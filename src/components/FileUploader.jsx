import React, { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import axios from 'axios';

const FileUploader = ({ onUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file first!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:5001/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('File uploaded successfully!');
      onUpload(response.data); // Pass the response data to the parent component
    } catch (error) {
      alert('Error uploading file.');
      console.error(error);
    }
  };

  return (
    <Box sx={{ padding: 2, border: '1px solid #ccc', borderRadius: '8px' }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Upload a PDF for SESMag Review
      </Typography>
      <input type="file" onChange={handleFileChange} accept="application/pdf" style={{ marginBottom: '10px' }} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleUpload}
        sx={{ marginTop: 2, backgroundColor: '#1976d2', ':hover': { backgroundColor: '#1565c0' } }}
      >
        Upload
      </Button>
    </Box>
  );
};

export default FileUploader;
