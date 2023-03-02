import Category from '../../src/entities/Category'
import app from '../../src/app'
import request from 'supertest'
import { connection} from 'mongoose'
import {User} from '../../src/entities/User'
import server from '../../src'
import { ObjectId} from "mongodb"

describe('Category routes', ()=>{
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
        await connection.close()
        server.close()
    })
    afterEach(async()=>{
        await  Category.deleteMany({})
    })
    describe('GET /category', ()=>{
        it('should return many categories', async()=>{
            const ExpectedData = [ {name:'first'}, {name:'second'}]
            await Category.insertMany(ExpectedData);
            const res =  await request(app).get('/category')
            expect(res.status).toBe(200)
            expect(res.body.categories[0].name).toEqual(ExpectedData[0].name)
            expect(res.body.categories[1].name).toEqual(ExpectedData[1].name)
        })
    })
    describe('GET /category/:id',()=>{
        it('should return the category by id', async()=>{
            const category = new Category({name:'first'})
            await category.save()
            const res = await request(app).get(`/category/${category._id}`)
            expect(res.status).toBe(200);
            expect(res.body.category.name).toEqual(category.name)
        })
        it('should return 500', async()=>{
            const res = await request(app).get('/category/id_not_used')
            expect(res.status).toBe(500)
        })
    })
    describe('POST /category', () => {
        it('should return the created object',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = {name:'first'}
            const res = await request(app).post('/category').send(category).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.category.name).toEqual('first')
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
            const category = {name:'first'}
            const res = await request(app).post('/category').send(category).set('authorization',resLogin.body.token)
            expect(res.status).toBe(401)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = {namE:'first'}
            const res = await request(app).post('/category').send(category).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('PUT /category/:id',()=>{
        it('should update created category',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const categoryUpdate = {name:'firstUpdated'}
            const res = await request(app).put(`/category/${category._id}`).send(categoryUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(200)
            expect(res.body.updatedCategory.name).toEqual('firstUpdated')
        })
        it('should return 404',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const categoryUpdate = {name:'firstUpdated'}
            const objectId = new ObjectId();
            const res = await request(app).put(`/category/${objectId}`).send(categoryUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(404)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const categoryUpdate = {name:'firstUpdated'}
            const res = await request(app).put(`/category/id_not_used`).send(categoryUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('DELETE /category/:id',()=>{
        it('should update created category',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const res = await request(app).delete(`/category/${category._id}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.category.name).toEqual('first')
            expect(res.body.message).toEqual('Categoria excluída com sucesso.')
        })
        it('should return 404',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const objectid = new ObjectId()
            const res = await request(app).delete(`/category/${objectid}`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(404)
        })
        it('should return 500',async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const category = new Category({name:'first'})
            await category.save()
            const res = await request(app).delete(`/category/id_not_used`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
})