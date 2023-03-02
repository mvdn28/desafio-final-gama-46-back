import {User,IUser } from '../../src/entities/User'
import app from '../../src/app'
import request from 'supertest'
import { connection } from 'mongoose'
import server from '../../src'


describe('User routes', ()=>{
    beforeAll(async()=>{
        server;
    })
    afterAll(async()=>{
        await connection.close()
        server.close()
    })
    afterEach(async()=>{
        await User.deleteMany({})
    })
    describe('GET /User', ()=>{
        it('should return many categories', async()=>{
            const user = {name:'testName', email:'testEmail', password:'testPassword',role:"admin"}
            const user2 = {name:'testName2', email:'testEmail2', password:'testPassword2',role:"admin"}
            const ExpectedData = [ user, user2]
            await User.insertMany(ExpectedData as IUser[]);
            const res =  await request(app).get('/User')
            expect(res.status).toBe(200)
            expect(res.body.users[0].name).toEqual(ExpectedData[0].name)
            expect(res.body.users[1].name).toEqual(ExpectedData[1].name)
        })
    })
    describe('GET /User/:id',()=>{
        it('should return the User by id', async()=>{
            const user = new User({name:'testName', email:'testEmail', password:'testPassword',role:"admin"})
            await user.save()
            const res = await request(app).get(`/User/${user._id}`)
            expect(res.status).toBe(200);
            expect(res.body.user.name).toEqual(user.name)
        })
        it('should return 500', async()=>{
            const res = await request(app).get('/User/id_not_used')
            expect(res.status).toBe(500)
        })
    })
    describe('POST /User', () => {
        it('should return the created object',async()=>{
            const user = new User({name:'testName', email:'testEmail', password:'testPassword',role:"admin"})
            await user.save()
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const user2 = {name:'testName2', email:'testEmail2', password:'testPassword2',role:"admin"}
            const res = await request(app).post('/User').send(user2).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.user.name).toEqual('testName2')
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
            const user = {name:'testName', email:'testEmail', password:'testPassword',role:"admin"}
            const res = await request(app).post('/User').send(user).set('authorization',resLogin.body.token)
            expect(res.status).toBe(401)
        })
        it('should return 500',async()=>{
            const user = new User({name:'testName', email:'testEmail', password:'testPassword',role:"admin"})
            await user.save()
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const user2 = {namE:'testName', email:'testEmail', password:'testPassword',role:"admin"}
            const res = await request(app).post('/User').send(user2).set('authorization',resLogin.body.token)
            expect(res.status).toBe(500)
        })
    })
    describe('PUT /User/:id',()=>{
        it('should update created User',async()=>{
            const user = new User({name:'testName', email:'testEmail', password:'testPassword',role:"admin"})
            await user.save()
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const UserUpdate = {name:'testNameUpdated', email:'testEmail', password:'testPassword',role:"admin"}
            const res = await request(app).put(`/User`).send(UserUpdate).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.updatedUser.name).toEqual('testNameUpdated')
        })
    })
    describe('DELETE /User/:id',()=>{
        it('should update created User',async()=>{
            const user = new User({name:'testName', email:'testEmail', password:'testPassword',role:"admin"})
            await user.save()
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const res = await request(app).delete(`/User`).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
            expect(res.body.user.name).toEqual('testName')
            expect(res.body.message).toEqual('Usuário excluído com sucesso.')
        })
    })
})