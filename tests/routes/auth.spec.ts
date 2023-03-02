import Category from '../../src/entities/Category'
import app from '../../src/app'
import request from 'supertest'
import mongoose, { connection } from 'mongoose'
import {User} from '../../src/entities/User'
import server from '../../src'


describe('Auth routes', ()=>{
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
    describe('POST /auth/login', ()=>{
        it('should return an error that the password is incorrect', async()=>{
            const login = {email:'testEmail',password:'PasswordNotCorrect'}
            const res = await request(app).post('/auth/login').send(login)
            expect(res.status).toBe(401)
            expect(res.body.message).toEqual('E-mail ou senha inválidos.')
        })
        it('should return an error that the email is incorrect', async()=>{
            const login = {email:'testEmailNotCorrect',password:'testPassword'}
            const res = await request(app).post('/auth/login').send(login)
            expect(res.status).toBe(401)
            expect(res.body.message).toEqual('E-mail ou senha inválidos.')
        })
        it('should return the token', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const res = await request(app).post('/auth/login').send(login)
            expect(res.status).toBe(200)
            expect(res.body.token).toBeTruthy()
        })
    })
    describe('POST /auth/change', ()=>{
        it('should return an error that the wrong password was provided', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const change = {oldPassword:'testPasswordWrong',newPassword:'testPasswordWrong'}
            const res = await request(app).post('/auth/change').send(change).set('authorization',resLogin.body.token)
            expect(res.status).toBe(400)
        })
        it('should return a succes message', async()=>{
            const login = {email:'testEmail',password:'testPassword'}
            const resLogin = await request(app).post('/auth/login').send(login)
            const change = {oldPassword:'testPassword',newPassword:'testNewPassword'}
            const res = await request(app).post('/auth/change').send(change).set('authorization',resLogin.body.token)
            expect(res.status).toBe(201)
        })
    })
})