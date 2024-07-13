import fastify from 'fastify'
import fastifyCookie from '@fastify/cookie'
import cors from '@fastify/cors'
import crypto, { hash } from 'node:crypto'

import { knex } from './database'

import { env } from './env'
import { z } from 'zod'
import { checkSessionIdExists } from './middlewares/check-session-id-exists'

const app = fastify()

app.register(fastifyCookie)
app.register(cors, {
    origin: true
})

const userParamsSchema = z.object({
    id: z.string()
})

const userSchema = z.object({
    name: z.string().nullish(),
    email: z.string().nullish(),
    password: z.string(),
    old_password: z.string().optional(),
    role: z.string().optional(),
    about: z.string().optional(),
    linkedin: z.string().optional(),
    github: z.string().optional(),
    avatar: z.string().optional()
})

app.post('/user', async (request, reply) => {

    const { name, email, password, role, about, linkedin, github, avatar } = userSchema.parse(request.body)

    await knex('users').insert({
        id: crypto.randomUUID(),
        name,
        email,
        password,
        role,
        about,
        linkedin,
        github
    })

    return reply.status(201).send()
})

app.get('/users', async () => {

    const users = await knex('users').select()

    return users
})

app.get('/user/:id', async (request, reply) => {

    const { id } = userParamsSchema.parse(request.params)

    const users = await knex('users')
        .where({
            id,
            // session_id: sessionId
        })
        .first()

    return { users }
})

app.delete('/user/:id',
    {
        preHandler: [checkSessionIdExists]
    },
    async (request, reply) => {
    const { sessionId } = request.cookies

    const { id } = userParamsSchema.parse(request.params)

    await knex('users')
        .where({
            id,
            session_id: sessionId
        })
        .delete()

    return reply.status(204).send()
})

app.put('/user/:id',
    async (request, reply) => {

    // const { sessionId } = request.cookies

    const { id } = userParamsSchema.parse(request.params)

    const {  name, email, password, old_password, role, about, linkedin, github, avatar} = userSchema.parse(request.body)

    const user = await knex('users').where({
        id}).first()

    if(!user) {
        return reply.status(404).send("Usuário não encontrado") 
    }

    const userWithUpdatedEmail = await knex('users').where({
        email,
    }).first()

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id){
        return reply.status(406).send("Este e-mail já está em uso")
    }

    user.name = name ?? user.name
    user.email = email ?? user.email
    user.password = password ?? user.password
    user.role = role ?? user.role
    user.about = about ?? user.about
    user.linkedin = linkedin ?? user.linkedin
    user.github = github ?? user.github

    if( password && !old_password){
        return reply.status(406).send("Voce precisa informar a senha antiga para definir a nova senha")
    }

    if (password && old_password) {
        const checkOldPassword = old_password === user.password

        if (!checkOldPassword) {
            return reply.status(401).send("A senha antiga não confere.")
        }
        user.password = password
    }

    await knex('users').where({
        id,
        // session_id: sessionId
    }).update({
        user
    })

    return reply.status(204).send() 
    })

app.post('/login', async (request, reply) => {

        const { email, password } = userSchema.parse(request.body)

        let { sessionId } = request.cookies

        if (!sessionId) {
            sessionId = crypto.randomUUID()
            reply.cookie('sessionId', sessionId, {
                path: '/',
                maxAge: 60 * 60 * 24 * 7 // 7 days
            })
        }

        const user = await knex("users").where({ email }).first()

        if(!user) {
            return reply.status(401).send("Email e/ou senha incorreta")
        }

        const passwordMatched = password === user.password
        if(!passwordMatched){
            return reply.status(401).send("Email e/ou senha incorreta")
        }

        return reply.send({user, sessionId})
})


app.listen({
    port: env.PORT
}).then(() => {
    console.log('Server running on port 3333')
})