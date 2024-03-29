import Order, { IOrder } from '../../src/entities/Order'
import app from '../../src/app'
import request from 'supertest'
import { connection } from 'mongoose'
import Category from '../../src/entities/Category'
import server from '../../src'
import Product from '../../src/entities/Product'
import { User } from '../../src/entities/User'
import { ObjectId } from "mongodb"
import Coupon from '../../src/entities/Coupon'


describe('Order routes', ()=>{
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
        var testProduct = new Product({ 
            name:'ProdName', 
            description:'ProdDesc', 
            price:50,
            image:'ProdImage',
            category:testCategory!._id}
        )
        await testProduct.save()
        var testProduct2 = new Product({ 
            name:'ProdName2', 
            description:'ProdDesc2', 
            price:100,
            image:'ProdImage',
            category:testCategory!._id}
        )
        await testProduct2.save()
        var testCoupon = new Coupon({
            name:"test10",
            discount:10
        })
        await testCoupon.save()
    })
    afterAll(async()=>{
        await User.deleteMany({})
        await Category.deleteMany({})
        await Product.deleteMany({})
        await Coupon.deleteMany({})
        await connection.close()
        server.close()
    })
    afterEach(async()=>{
        await  Order.deleteMany({})
    })
    describe('GET /Order', ()=>{
        it('should return many Orders', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = {products , total:150, user:user!._id}
            const order2 = {products:[products[0]] , total:50, user:user!._id}
            const ExpectedData = [order , order2]
            await Order.insertMany(ExpectedData as unknown as IOrder[]);
            const res =  await request(app).get('/order').set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.orders[0].total).toEqual(ExpectedData[0].total)
            expect(res.body.orders[1].total).toEqual(ExpectedData[1].total)
        })
    })
    describe('GET /Order/:id',()=>{
        it('should return the Order by id', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products , total:150, user:user!._id})
            await order.save()
            const res = await request(app).get(`/Order/${order._id}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200);
            expect(res.body.order.total).toEqual(order.total)
        })
        it('should return 500', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const res = await request(app).get('/Order/id_not_used').set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('POST /Order', () => {
        it('should return the created object',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const order = {products}
            const res = await request(app).post('/Order').send(order).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.order.total).toEqual(150)
        })
        it('should return the created object wiht coupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const coupon = await Coupon.findOne({name:"test10"})
            const order = {products, couponId:coupon!._id}
            const res = await request(app).post('/Order').send(order).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.order.total).toEqual(135)
        })
        it('should return 400 because of invalid coupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const couponId = new ObjectId()
            const order = {products, couponId}
            const res = await request(app).post('/Order').send(order).set('authorization',resLogin.body.token)
            expect(res.status).toBe(400)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const productS = await Product.find()
            const order = {productS}
            const res = await request(app).post('/Order').send(order).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('PUT /Order/:id',()=>{
        it('should updated Order',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products:[products[0]] , total:50, user:user!._id})
            await order.save()
            const OrderUpdate = {products}
            const res = await request(app).put(`/Order/${order._id}`).send(OrderUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.updatedOrder.total).toEqual(150)
        })
        it('should update Order with cupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products:[products[0]] , total:50, user:user!._id})
            await order.save()
            const coupon = await Coupon.findOne({name:"test10"})
            const OrderUpdate = {couponId:coupon!._id}
            const res = await request(app).put(`/Order/${order._id}`).send(OrderUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.updatedOrder.total).toEqual(45)
        })
        it('should return 400 with invalid cupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products:[products[0]] , total:50, user:user!._id})
            await order.save()
            const couponId = new ObjectId()
            const OrderUpdate = {couponId}
            const res = await request(app).put(`/Order/${order._id}`).send(OrderUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(400)
        })
        it('should return 404',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products , total:150, user:user!._id})
            await order.save()
            const OrderUpdate = {products:[products[1]]}
            const objectid = new ObjectId()
            const res = await request(app).put(`/Order/${objectid}`).send(OrderUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(404)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products , total:150, user:user!._id})
            await order.save()
            const OrderUpdate = {products:[products[1]]}
            const res = await request(app).put(`/Order/id_not_used`).send(OrderUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('DELETE /Order/:id',()=>{
        it('should update created Order',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products , total:150, user:user!._id})
            await order.save()
            const res = await request(app).delete(`/order/${order._id}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.order.total).toEqual(150)
            expect(res.body.message).toEqual("Pedido excluído com sucesso")
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const products = await Product.find()
            const user = await User.findOne({name:'testUser'})
            const order = new Order({products , total:150, user:user!._id})
            await order.save()
            const res = await request(app).delete(`/Order/id_not_used`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
})