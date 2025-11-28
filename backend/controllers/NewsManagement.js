import pool from "../pool.js";
import multer from "multer";
import path from "path";

/* ไว้upload pdf */
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/news"),
    filename: (req, file, cb) =>
        cb(null, Date.now() + "-" + file.originalname)
});

export const uploadNewsFile = multer({ storage }).single("news_file");

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
    const { news_title, news_content } = req.body;
    const news_file = req.file ? req.file.filename : null;

    const newsAdd = `INSERT INTO news (news_title, news_content, news_file, is_active) VALUES (?, ?, ?, ?)`
    try {
        connection = await pool.getConnection();

        const [newsResult] = await connection.execute(newsAdd, [news_title, news_content, news_file, true]);
        const newsId = newsResult.insertId

        await connection.commit();
        res.status(201).json({ message: 'Created succesfully', newsId })

    } catch (err) {
        return res.status(500).json({ message: 'Create is failed , Server error' })
    } finally {
        connection.release();
    }
}

/* แก้ไชช่าว */
export const updateNews = async (req, res) => {
    const { id } = req.params;
    const { news_title, news_content, is_active } = req.body;
    const news_file = req.file ? req.file.filename : undefined;

    connection = await pool.getConnection();
    await connection.beginTransaction();

    try {

        /* รอรับค่า */
        const fields = []
        const values = []

        if (news_title) {
            fields.push("news_title = ?");
            values.push(news_title);
        }

        if (news_content) {
            fields.push("news_content = ?");
            values.push(news_content);
        }

        if (is_active !== undefined) {
            fields.push("is_active = ?");
            values.push(is_active);
        }

        if (news_file) {
            fields.push("news_file = ?");
            values.push(news_file);
        }

        if (fields.length === 0) {
            return res.status(400).json({ message: "No fields to update" });
        }


        /* update ข้อมูล */
        const query = `UPDATE news SET ${fields.join(", ")} WHERE news_id = ?`
        values.push(id);
        const [result] = await connection.execute(query, values);

        /* ไม่พบข่าวที่ต้องการ update */
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'news not found' })
        }
        await connection.commit();
        res.status(200).json({ message: 'updated succesfully' })

    } catch (err) {
        if (connection) await connection.rollback();
        console.error(err);
        res.status(500).json({ message: "Update failed" });

    } finally {
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