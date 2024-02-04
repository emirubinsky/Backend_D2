// DESAFIO 2

import fs from 'fs/promises';


// Se crea clase "ProductManager" que permite trabajar con múltiples productos. Cuenta con una variable "this.path" inicializada desde el constructor.  

class ProductManager {
    constructor(filePath) {
        this.path = filePath;
        this.nextId = 1;
    }


// El método "addProduct" recibe un objeto, asigna un id autoincrementable y lo guarda en el arreglo.

    async addProduct(product) {
        try {
            const products = await this.getProducts();
            product.id = this.nextId++;
            products.push(product);
            await this.writeToFile(products);
            return product;
        } catch (error) {
            throw error;
        }
    }

//  El método getProducts lee el archivo de productos y devuelve todos los productos en formato de arreglo.

    async getProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf-8');
            return JSON.parse(data) || [];
        } catch (error) {
            if (error.code === 'ENOENT' || error.message.includes('unexpected end of JSON input')) {
                return [];
            } else {
                throw error;
            }
        }
    }


//  El método "getProductById" recibe un id, lee el archivo y devuelve el producto con el id especificado en formato objeto. En caso de no encontrarlo, devuelve null.

    async getProductById(id) {
        try {
            const products = await this.getProducts();
            const product = products.find(p => p.id === id);
            return product || null;
        } catch (error) {
            throw error;
        }
    }

// El método "updateProduct" recibe el id del producto a actualizar y el campo a actualizar, y actualiza el producto que tiene ese id en el archivo. No borra el id del producto.

    async updateProduct(id, updatedFields) {
        try {
            const products = await this.getProducts();
            const index = products.findIndex(p => p.id === id);
            if (index !== -1) {
                products[index] = { ...products[index], ...updatedFields };
                await this.writeToFile(products);
                return products[index];
            } else {
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

// El método deleteProduct recibe un id y elimina el producto que tiene ese id en el archivo.

    async deleteProduct(id) {
        try {
            const products = await this.getProducts();
            const updatedProducts = products.filter(p => p.id !== id);
            await this.writeToFile(updatedProducts);
            return true;
        } catch (error) {
            throw error;
        }
    }

    async writeToFile(data) {
        try {
            await fs.writeFile(this.path, JSON.stringify(data, null, 2), 'utf-8');
        } catch (error) {
            throw error;
        }
    }
}

// Ejemplo 

const productManager = new ProductManager('productos.json');

(async () => {
    try {
        const newProduct = await productManager.addProduct({
            title: 'Producto 1',
            description: 'Descripción del producto 1',
            price: 19.99,
            thumbnail: 'imagen1.jpg',
            code: 'P001',
            stock: 10
        });
        console.log('Nuevo producto:', newProduct);

        const allProducts = await productManager.getProducts();
        console.log('Todos los productos:', allProducts);

        const productId = 1; // Reemplazar con un ID válido
        const productById = await productManager.getProductById(productId);
        console.log(`Producto con ID ${productId}:`, productById);

        const updatedProduct = await productManager.updateProduct(productId, {
            price: 24.99,
            stock: 15
        });
        console.log('Producto actualizado:', updatedProduct);

        const deleteResult = await productManager.deleteProduct(productId);
        console.log('Producto eliminado:', deleteResult);

        const remainingProducts = await productManager.getProducts();
        console.log('Productos restantes:', remainingProducts);
    } catch (error) {
        console.error('Error:', error.message);
    }
})();








