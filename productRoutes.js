// Modificar el schema de producto
const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  });
  
  // Endpoint para crear un nuevo producto
  app.post('/api/products', async (req, res) => {
    try {
      const { name, description, owner } = req.body;
  
      // Crear un nuevo producto y asignar el propietario (si se proporciona)
      const product = new Product({
        name,
        description,
        owner: owner || 'admin'
      });
      await product.save();
  
      res.json({ message: 'Producto creado exitosamente.' });
    } catch (error) {
      console.error('Error al crear el producto:', error);
      res.status(500).json({ message: 'Ocurrió un error al crear el producto.' });
    }
  });
  
  // Endpoint para eliminar un producto
  app.delete('/api/products/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
      const { userId, role } = req.body;
  
      // Buscar el producto por su ID
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado.' });
      }
  
      // Verificar los permisos de eliminación
      if (role === 'admin' || (role === 'premium' && product.owner === userId)) {
        await product.remove();
        return res.json({ message: 'Producto eliminado exitosamente.' });
      }
  
      res.status(403).json({ message: 'No tienes permisos para eliminar este producto.' });
    } catch (error) {
      console.error('Error al eliminar el producto:', error);
      res.status(500).json({ message: 'Ocurrió un error al eliminar el producto.' });
    }
  });
  