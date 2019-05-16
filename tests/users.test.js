const request = require('supertest')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const app = require('../src/app')
const User = require('../src/models/user')

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Kishore',
    email: 'kishore1@gmail.com',
    password: 'pwd12345',
    tokens: [{
        token: jwt.sign({'_id': userOneId}, process.env.JWT_SECRET)
    }]
}

beforeEach(async()=>{
    await User.deleteMany()
    await new User(userOne).save()
})

test('Should Signup New User', async ()=>{
    const response = await request(app).post("/users").send({
        name: 'Kishore',
        email: 'kishore@gmail.com',
        password: 'pwd12345'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: 'Kishore',
            email: 'kishore@gmail.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('pwd12345')
})

test('Login User', async()=>{
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
})

test('Login with bad credentials', async()=>{
    await request(app).post("/users/login").send({
        email: userOne.email,
        password: 'one'
    }).expect(400)
})

test('Get Profile', async()=>{
    await request(app).get("/users/me")
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

})

test('Get Profile with No token', async()=>{
    await request(app).get("/users/me").expect(401)
})

test("Should Upload avatar image", async()=>{
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar', 'tests/fixtures/avatar.jpeg')
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user field", async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: "Kishore Kumar"
        })
        .expect(200)
    
    const user = await User.findById(userOneId)
    expect(user.name).toEqual("Kishore Kumar")
})

test("Should not update invalid user field", async()=>{
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: "Chennai"
        })
        .expect(400)

})