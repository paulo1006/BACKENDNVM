// Import necessary packages
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

// Initialize Express app
const app = express();
const port = 3000;

// Supabase client initialization
const supabase = createClient('https://auxaqrdhrcotbdruottq.supabase.co', 
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF1eGFxcmRocmNvdGJkcnVvdHRxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY4NDkyMzAsImV4cCI6MjAzMjQyNTIzMH0.Dh4kN9-Z6CLPNxb3TvQFv7fnLlfpamea37fVIJx4G80');

// Use CORS
const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Use morgan for logging
app.use(morgan('combined'));

// Use bodyParser to parse JSON bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Get all products
app.get('/products', async (req, res) => {
  const { data, error } = await supabase
    .from('products')
    .select();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Get product by id
app.get('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('products')
    .select()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

// Create a new product
app.post('/products', async (req, res) => {
  const { name, description, price } = req.body;

  const { error } = await supabase
    .from('products')
    .insert({ name, description, price });

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: 'Product created successfully!' });
});

// Update a product
app.put('/products/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description, price } = req.body;

  const { data, error } = await supabase
    .from('products')
    .update({ name, description, price })
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Product updated successfully!', data });
});

// Delete a product
app.delete('/products/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(200).json({ message: 'Product deleted successfully!' });
});

// Test route
app.get('/', (req, res) => {
  res.send("Hello I am working my friend Supabase <3");
});

app.get('*', (req, res) => {
  res.send("Hello again I am working my friend to the moon and beyond <3");
});

// Start the server
app.listen(port, () => {
  console.log(`> Ready on http://localhost:${port}`);
});