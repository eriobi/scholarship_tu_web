import pool from "../pool.js";

let connection = await pool.getConnection();

export const getScholarshipStats = async (req, res) => {
    const schoId = req.params.id;
    const userId = req.user?.user_id || null;

    try {
        /* จำนวนที่ enroll */
        const [[{ total }]] = await connection.execute(
            `SELECT COUNT(*) AS total
            FROM enroll
            WHERE scho_id = ?`,
            [schoId]
        );

        /* จำนวนที่ได้รับทุน */
        const [[{ approved }]] = await connection.execute(
            `SELECT COUNT(*) AS approved
            FROM enroll
            WHERE scho_id = ? AND enroll_status = 1`,
            [schoId]
        );

        const rejected = total - approved;
        const percent = total > 0 ? ((approved / total) * 100).toFixed(2) : 0;

        /* เช็คเงื่อนไขว่าตรงกันไหม */
        let qualifyResult = null;

        if (userId) {
            const [[student]] = await connection.execute(
                `SELECT std_id, std_year, std_gpa, std_income
                 FROM student WHERE user_id = ?`,
                [userId]
            );

            if (student) {
                const [[req]] = await connection.execute(
                `SELECT q.std_year AS req_year,
                  q.std_gpa AS req_gpa,
                  q.std_income AS req_income
                FROM scholarship_info s
                JOIN qualification q ON s.qualification = q.qua_id
                WHERE s.scholarship_id = ?`,
                    [schoId]
                );

                qualifyResult = {
                    year_ok: student.std_year >= req.req_year,
                    gpa_ok: student.std_gpa >= req.req_gpa,
                    income_ok:
                        parseInt(student.std_income) <= parseInt(req.req_income),
                };
            }
        }

        return res.json({
            total,
            approved,
            rejected,
            percent,
            qualify: qualifyResult, /* ถ้าไม่ใช้นศ return null */
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Server Error" });
    } finally {
        connection.release()
    }
}