// Endpoint para agregar un producto al carrito
app.post('/api/cart', async (req, res) => {
    try {
      const { productId, userId, role } = req.body;
  
      // Verificar si el usuario premium está agregando su propio producto al carrito
      if (role === 'premium' && userId === product.owner) {
        return res.status(400).json({ message: 'No puedes agregar tu propio producto al carrito.' });
      }
  
      // Lógica para agregar el producto al carrito
  
      res.json({ message: 'Producto agregado al carrito exitosamente.' });
    } catch (error) {
      console.error('Error al agregar el producto al carrito:', error);
      res.status(500).json({ message: 'Ocurrió un error al agregar el producto al carrito.' });
    }
  });
  