import Coupon, { ICoupon } from '../../src/entities/Coupon'
import app from '../../src/app'
import request from 'supertest'
import connect from '../../src/database/connect'
import mongoose, { connection } from 'mongoose'
import {User} from '../../src/entities/User'
import server from '../../src'


describe('Coupon routes', ()=>{
    beforeAll(async()=>{
        server;
        const testUser = new User({
            name:'testUser',
            email:'testEmail',
            password:'testPassword',
            role:"admin"
        })
        await testUser.save()
    })
    afterAll(async()=>{
        await User.deleteMany({})
        await mongoose.connection.close()
        server.close()
    })
    afterEach(async()=>{
        await  Coupon.deleteMany({})
    })
    describe('GET /Coupon', ()=>{
        it('should return many categories', async()=>{
            const ExpectedData = [ {name:'firstCoupon',discount:30}, {name:'secondCoupon',discount:40}]
            await Coupon.insertMany(ExpectedData as ICoupon[]);
            const res =  await request(app).get('/coupon')
            expect(res.status).toBe(200)
            expect(res.body.coupons[0].name).toEqual(ExpectedData[0].name)
            expect(res.body.coupons[1].name).toEqual(ExpectedData[1].name)
        })
    })
    describe('GET /Coupon/:id',()=>{
        it('should return the Coupon by id', async()=>{
            const cupom = new Coupon({name:'firstCoupon',discount:30})
            await cupom.save()
            const res = await request(app).get(`/Coupon/${cupom._id}`)
            expect(res.status).toBe(200);
            expect(res.body.coupon.name).toEqual(cupom.name)
        })
        it('should return 500', async()=>{
            const res = await request(app).get('/coupon/id_not_used')
            expect(res.status).toBe(500)
        })
    })
    describe('POST /Coupon', () => {
        it('should return the created object',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = {name:'firstCoupon',discount:30}
            const res = await request(app).post('/Coupon').send(cupom).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.coupon.name).toEqual('firstCoupon')
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
            const cupom = {name:'firstCoupon',value:30}
            const res = await request(app).post('/Coupon').send(cupom).set('authorization',resLogin.body.token)
            expect(res.status).toBe(401)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = {namE:'firstCoupon',value:30}
            const res = await request(app).post('/Coupon').send(cupom).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('PUT /Coupon/:id',()=>{
        it('should update created Coupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = new Coupon({name:'firstCoupon',discount:30})
            await cupom.save()
            const CouponUpdate = {name:'firstCouponUpdated'}
            const res = await request(app).put(`/Coupon/${cupom._id}`).send(CouponUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.updatedCoupon.name).toEqual('firstCouponUpdated')
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = new Coupon({name:'firstCoupon',discount:30})
            await cupom.save()
            const CouponUpdate = {name:'firstCouponUpdated'}
            const res = await request(app).put(`/Coupon/id_not_used`).send(CouponUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('DELETE /Coupon/:id',()=>{
        it('should update created Coupon',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = new Coupon({name:'firstCoupon',discount:30})
            await cupom.save()
            const res = await request(app).delete(`/Coupon/${cupom._id}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.coupon.name).toEqual('firstCoupon')
            expect(res.body.message).toEqual('Cupom removido com sucesso.')
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const cupom = new Coupon({name:'firstCoupon',discount:30})
            await cupom.save()
            const res = await request(app).delete(`/Coupon/id_not_used`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
})