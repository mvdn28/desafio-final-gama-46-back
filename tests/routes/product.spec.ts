import Product, { IProduct } from '../../src/entities/Product'
import app from '../../src/app'
import request from 'supertest'
import { connection } from 'mongoose'
import {User} from '../../src/entities/User'
import Category from '../../src/entities/Category'
import server from '../../src'


describe('Product routes', ()=>{
    beforeAll(async()=>{
        server
        const testUser = new User({
            name:'testUser',
            email:'testEmail',
            password:'testPassword',
            role:"admin"
        })
        await testUser.save()
        var testCategory = new Category({
            name:'testCategory'
        })
        await testCategory.save()
    })
    afterAll(async()=>{
        await User.deleteMany({})
        await Category.deleteMany({})
        await connection.close()
        server.close()
    })
    afterEach(async()=>{
        await  Product.deleteMany({})
    })
    describe('GET /product', ()=>{
        it('should return many Products', async()=>{
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = { name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id}
            const product2 = { name:'ProdName2', description:'ProdDesc2', price:100, image:'ProdImage2',category:testCategory!._id}
            const ExpectedData = [ product,product2]
            await Product.insertMany(ExpectedData as unknown as IProduct[]);
            const res =  await request(app).get('/product')
            expect(res.status).toBe(200)
            expect(res.body.products[0].name).toEqual(ExpectedData[0].name)
            expect(res.body.products[1].name).toEqual(ExpectedData[1].name)
        })
    })
    describe('GET /product/:id',()=>{
        it('should return the Product by id', async()=>{
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = new Product({ name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id})
            await product.save()
            const res = await request(app).get(`/product/${product._id}`)
            expect(res.status).toBe(200);
            expect(res.body.product.name).toEqual(product.name)
        })
        it('should return 500', async()=>{
            const res = await request(app).get('/product/id_not_used')
            expect(res.status).toBe(500)
        })
    })
    describe('POST /product', () => {
        it('should return the created object',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = { name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id}
            const res = await request(app).post('/product').send(product).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.product.name).toEqual(product.name)
        })
        it('should return an unauthorized error',async()=>{
            const testUserNotAdmin = new User({
                name:'testUserNotAdmin',
                email:'testEmailNotAdmin',
                password:'testPasswordNotAdmin',
                role:"client"
            })
            await testUserNotAdmin.save()
            const login = {email:'testEmailNotAdmin',password:'testPasswordNotAdmin'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = { name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id}
            const res = await request(app).post('/Product').send(product).set('authorization',resLogin.body.token)
            expect(res.status).toBe(401)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = { namE:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id}
            const res = await request(app).post('/Product').send(product).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('PUT /Product/:id',()=>{
        it('should update created Product',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = new Product({ name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id})
            await product.save()
            const ProductUpdate = {name:'ProdNameUpdate'}
            const res = await request(app).put(`/Product/${product._id}`).send(ProductUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.updatedProduct.name).toEqual(ProductUpdate.name)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = new Product({ name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id})
            await product.save()
            const ProductUpdate = {name:'ProdNameUpdate'}
            const res = await request(app).put(`/product/id_not_used`).send(ProductUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('DELETE /Product/:id',()=>{
        it('should update created Product',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = new Product({ name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id})
            await product.save()
            const res = await request(app).delete(`/product/${product._id}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.product.name).toEqual('ProdName')
            expect(res.body.message).toEqual("Produto deletado com sucesso")
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const testCategory = await Category.findOne({name:'testCategory'})
            const product = new Product({ name:'ProdName', description:'ProdDesc', price:50, image:'ProdImage',category:testCategory!._id})
            await product.save()
            const res = await request(app).delete(`/product/id_not_used`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
})