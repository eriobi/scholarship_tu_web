import pool from "../pool.js";

let connection;

/* get news */
export const getNews = async (req, res) => {
    try {
        const [row] = await pool.execute('SELECT * FROM news WHERE is_active = 1 ORDER BY created_at DESC')
        res.json(row)

    } catch (err) {
        console.log(err)
        return res.status(500).json({ message: 'Server error' })
    }
}

/* เพิ่มข่าว */
export const createNews = async (req, res) => {
    const {news_title,news_content} = req.body
    
    const newsAdd = `INSERT INTO news (news_title,news_content,is_active) VALUES (?,?,?)`
    try{
        connection = await pool.getConnection();

        const [newsResult] = await connection.execute(newsAdd, [news_title, news_content,true]);
        const newsId = newsResult.insertId

        await connection.commit();
        res.status(201).json({ message: 'Created succesfully', newsId })

    }catch(err){
        return res.status(500).json({ message: 'Create is failed , Server error' })
    }finally{
        connection.release();
    }
}

/* แก้ไชช่าว */
export const updateNews = async (req, res) =>{
    const { id } = req.params;
    const updateData = req.body;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    try{
         if (!Object.keys(updateData).length) {
            return res.status(404).json({ message: 'There is no information to update' })
        }
        const [rows] = await connection.query(
            "SELECT is_active FROM news WHERE news_id = ?",
            [id]
        );
        const oldValue = rows[0]?.is_active;
        console.log("DB value:", oldValue);
        console.log("New value:", updateData.is_active);

        /* รอรับค่า */
        const fields = []
        const values = []
        /* loop */
        for (const [key, value] of Object.entries(updateData)) { 
            if (value !== undefined) {
                fields.push(`${key} = ?`);
                values.push(value);
            }
        }

        /* update ข้อมูล */
        const query = `UPDATE news SET news_title=?, news_content=?, is_active=? WHERE news_id=?` 
        values.push(id);
        const [result] = await connection.execute(query, values);

        /* ไม่พบข่าวที่ต้องการ update */
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'news invalid' })
        }
        await connection.commit();
        res.status(200).json({ message: 'updated succesfully' })

    }catch(err){
        if (connection) await connection.rollback();
        console.error(err);
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Update failed, server error' });
        }

    }finally{
        connection.release();
    }
}

export const deleteNews = async (req, res) => {
    const { ids } = req.body;
    if (!ids || ids.length === 0) return res.status(400).json({ message: "No IDs provided" });
    try {
        const placeholders = ids.map(() => "?").join(",");
        const sql = `DELETE FROM news WHERE news_id IN (${placeholders})`;
        await pool.query(sql, ids);
        res.status(204).json({ message: 'deleted succesfully' })

    } catch (err) {
        return res.status(500).json({ message: 'delete is failed ,Server error' })
    }
}