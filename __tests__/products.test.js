const request = require('supertest');
const app = require('../app');

//Step 4: Writing Tests for GET Requests
//Write a test for the GET /products route to verify that it returns the list of products
describe('GET /products', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/products');
      expect(response.statusCode).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body.length).toBeGreaterThan(0); // Check that there are products
    });
});

//Write a test for GET /products/ to verify that a single product can be retrieved by its ID
describe('GET /products/:id', () => {
    it('should return a product by ID', async () => {
      const response = await request(app).get('/products/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id', 1);
    });
  
    it('should return 404 if product not found', async () => {
      const response = await request(app).get('/products/999'); // assuming 999 doesn't exist
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
    });
});

//Part 5: Testing POST Requests
//Write a test for the POST /products route to verify that a new product can be added
describe('POST /products', () => {
    it('should add a new product', async () => {
      const newProduct = { name: 'Tablet', price: 300, stock: 15 };
      const response = await request(app)
        .post('/products')
        .send(newProduct);
      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id'); // ensure ID is generated
      expect(response.body).toMatchObject(newProduct); // ensure the added product matches the request
    });
});

//Part 6: Testing PUT Requests
//Write a test for the PUT /products/ route to verify that an existing product can be updated
//ผมแก้ตัวนี้โคตรนานเลยครับ อาจารย์นุ่น พี่โอ๊ต ;-; ผมเศร้ามากว่าจะได้ 100%
describe('PUT /products/:id', () => {
    let originalProduct;
 
    beforeEach(async () => {
      const res = await request(app).get('/products/1'); // ดึงข้อมูลสินค้าก่อน
      originalProduct = res.body; // เก็บข้อมูลผลิตภัณฑ์ไว้ใช้เปรียบเทียบ
    });
 
    it('should update an existing product', async () => {
       const updateData = { name: 'Updated Laptop', price: 1500, stock: 8 }; // ข้อมูลการอัปเดต
       const response = await request(app)
          .put('/products/1') // ทดสอบการอัปเดตผลิตภัณฑ์ที่มีอยู่ (ID = 1)
          .send(updateData);
       
       expect(response.statusCode).toBe(200); // คาดหวังว่าสถานะการตอบสนองจะเป็น 200 (สำเร็จ)
       expect(response.body).toHaveProperty('name', 'Updated Laptop'); // คาดหวังให้ชื่อถูกอัปเดต
       expect(response.body).toHaveProperty('price', 1500); // คาดหวังให้ราคาถูกอัปเดต
       expect(response.body).toHaveProperty('stock', 8); // คาดหวังให้สต็อกถูกอัปเดต
    });
    
    // Test to ensure price remains unchanged if price is not provided
    it('should not change the price if price is not provided', async () => {
       const partialUpdate = { stock: 10 }; // อัปเดตแค่สต็อก
       const response = await request(app)
          .put('/products/1')
          .send(partialUpdate);
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveProperty('price', originalProduct.price); // ราคาควรคงเดิม
       expect(response.body).toHaveProperty('stock', 10); // สต็อกควรจะถูกเปลี่ยนเป็น 10
    });
 
    // Test to ensure stock remains unchanged if stock is not provided
    it('should not change the stock if stock is not provided', async () => {
       const partialUpdate = { price: 1200 }; // อัปเดตแค่ราคา
       const response = await request(app)
          .put('/products/1')
          .send(partialUpdate);
       expect(response.statusCode).toBe(200);
       expect(response.body).toHaveProperty('price', 1200); // ราคาควรจะถูกเปลี่ยนเป็น 1200
       expect(response.body).toHaveProperty('stock', originalProduct.stock); // สต็อกควรคงเดิม
    });
 
    it('should return 404 if product not found', async () => {
       const invalidProductId = 999; // สมมติว่า ID 999 ไม่มีในระบบ
       const response = await request(app)
          .put(`/products/${invalidProductId}`) // ทดสอบการอัปเดตผลิตภัณฑ์ที่ไม่มีในระบบ
          .send({ name: 'Nonexistent Product' }); // ข้อมูลที่ส่งไปยังผลิตภัณฑ์
       expect(response.statusCode).toBe(404); // คาดหวังให้สถานะเป็น 404
       expect(response.body).toHaveProperty('message', 'Product not found'); // คาดหวังข้อความข้อผิดพลาด
    });
 });
 
//Part 7: Testing DELETE Requests
//Write a test for the DELETE /products/ route to verify that a product can be deleted
describe('DELETE /products/:id', () => {
    it('should delete a product', async () => {
      const response = await request(app).delete('/products/1');
      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message', 'Product deleted');
    });
  
    it('should return 404 if product not found', async () => {
      const response = await request(app).delete('/products/999'); // assuming 999 doesn't exist
      expect(response.statusCode).toBe(404);
      expect(response.body).toHaveProperty('message', 'Product not found');
    });
  });