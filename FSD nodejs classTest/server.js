const http = require("http");
const fs = require("fs");

const PORT = 3000;

// Create students.json if it doesn't exist
if (!fs.existsSync("students.json")) {
    fs.writeFileSync("students.json", "[]");
}

// HTML form
const formPage = `
<!DOCTYPE html>
<html>
<head>
    <title>Student Record Management</title>
    <style>
        body {
            font-family: Arial;
            margin: 40px;
            background-color: #f4f4f4;
        }

        .container {
            width: 400px;
            margin: auto;
            background: white;
            padding: 25px;
            border-radius: 10px;
        }

        input {
            width: 100%;
            padding: 10px;
            margin: 8px 0 15px;
            box-sizing: border-box;
        }

        button {
            width: 100%;
            padding: 10px;
            background: #333;
            color: white;
            border: none;
            cursor: pointer;
        }

        a {
            display: block;
            margin-top: 20px;
            text-align: center;
        }
    </style>
</head>

<body>

<div class="container">

    <h2>Student Record Form</h2>

    <form method="POST" action="/add">

        <label>Student Name</label>
        <input type="text" name="name" required>

        <label>Roll Number</label>
        <input type="text" name="roll" required>

        <label>Course</label>
        <input type="text" name="course" required>

        <label>Email</label>
        <input type="email" name="email" required>

        <button type="submit">Add Student</button>

    </form>

    <a href="/students">View Student Records</a>

</div>

</body>
</html>
`;

// Create HTTP server
const server = http.createServer((req, res) => {

    // Home route
    if (req.method === "GET" && req.url === "/") {

        res.writeHead(200, {
            "Content-Type": "text/html"
        });

        res.end(`
            <h1>Welcome to Student Record Management System</h1>
            ${formPage}
        `);
    }

    // Add student
    else if (req.method === "POST" && req.url === "/add") {

        let body = "";

        // Receive data
        req.on("data", (chunk) => {
            body += chunk.toString();
        });

        // When all data is received
        req.on("end", () => {

            // Convert form data
            const params = new URLSearchParams(body);

            const student = {
                name: params.get("name"),
                roll: params.get("roll"),
                course: params.get("course"),
                email: params.get("email")
            };

            // Read existing students
            fs.readFile("students.json", "utf8", (err, data) => {

                if (err) {
                    res.writeHead(500, {
                        "Content-Type": "text/html"
                    });

                    return res.end("Error reading student records.");
                }

                let students = JSON.parse(data);

                // Add new student
                students.push(student);

                // Save updated data
                fs.writeFile(
                    "students.json",
                    JSON.stringify(students, null, 2),
                    (err) => {

                        if (err) {
                            res.writeHead(500, {
                                "Content-Type": "text/html"
                            });

                            return res.end("Error saving student record.");
                        }

                        // Redirect to students page
                        res.writeHead(302, {
                            Location: "/students"
                        });

                        res.end();
                    }
                );
            });
        });
    }

    // Display students
    else if (req.method === "GET" && req.url === "/students") {

        fs.readFile("students.json", "utf8", (err, data) => {

            if (err) {
                res.writeHead(500, {
                    "Content-Type": "text/html"
                });

                return res.end("Error reading records.");
            }

            const students = JSON.parse(data);

            let html = `
                <!DOCTYPE html>
                <html>
                <head>
                    <title>Student Records</title>
                    <style>
                        body {
                            font-family: Arial;
                            margin: 40px;
                        }

                        table {
                            border-collapse: collapse;
                            width: 100%;
                        }

                        th, td {
                            border: 1px solid black;
                            padding: 10px;
                            text-align: left;
                        }

                        th {
                            background-color: #333;
                            color: white;
                        }

                        a {
                            display: inline-block;
                            margin-top: 20px;
                        }
                    </style>
                </head>

                <body>

                <h1>Student Records</h1>

                <table>
                    <tr>
                        <th>Name</th>
                        <th>Roll Number</th>
                        <th>Course</th>
                        <th>Email</th>
                    </tr>
            `;

            students.forEach((student) => {

                html += `
                    <tr>
                        <td>${student.name}</td>
                        <td>${student.roll}</td>
                        <td>${student.course}</td>
                        <td>${student.email}</td>
                    </tr>
                `;
            });

            html += `
                </table>

                <a href="/">Add Another Student</a>

                </body>
                </html>
            `;

            res.writeHead(200, {
                "Content-Type": "text/html"
            });

            res.end(html);
        });
    }

    // Invalid route
    else {

        res.writeHead(404, {
            "Content-Type": "text/html"
        });

        res.end("<h1>404 - Page Not Found</h1>");
    }
});

// Start server
server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});