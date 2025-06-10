const express = require('express');
const cors = require('cors');

const app = express();
const authRoutes = require('./routes/authRoutes');
const employeeRoutes = require('./routes/employeeRoutes');
const departmentRoutes = require('./routes/departmentRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Running');
});

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/departments', departmentRoutes);


module.exports = app;
