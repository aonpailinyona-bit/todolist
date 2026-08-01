const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const path = require('path')
const dotenv = require ('dotenv')
dotenv.config()

const MemberController = {
    signup: async (req, res) => {
        try {
            const { name, username, password } = req.body
            const trimmedName = (name || '').trim()
            const trimmedUsername = (username || '').trim()
            const trimmedPassword = (password || '').trim()

            if (!trimmedName || !trimmedUsername || !trimmedPassword) {
                return res.status(400).json({ message: 'name, username and password are required' })
            }

            const hashedPassword = await bcrypt.hash(trimmedPassword, 10)
            const newMember = await prisma.member.create({
                data: {
                    name: trimmedName,
                    username: trimmedUsername,
                    password: hashedPassword
                }
            })
            res.json(newMember)
        } catch (err) {
            res.status(500).json({ error: err.message });
        }
    }, // <-- แก้ไข: เพิ่ม comma

    signin: async (req, res) => {
        try {
            const { username, password } = req.body
            const trimmedUsername = (username || '').trim()
            const trimmedPassword = (password || '').trim()

            if (!trimmedUsername || !trimmedPassword) {
                return res.status(400).json({ message: 'username and password are required' })
            }

            const findUser = await prisma.member.findFirst({
                where: { username: trimmedUsername },
                select: { id: true, password: true }
            })

            if (!findUser) return res.status(401).json({ message: 'unauthorized' })

            const compare = await bcrypt.compare(trimmedPassword, findUser.password)
            if (!compare) return res.status(401).json({ message: 'unauthorized' })

            const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
            const payload = { id: findUser.id }
            const options = { expiresIn: '1d' }

            const token = jwt.sign(payload, secret_key, options)

            res.json({ token })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },

    info: async (req, res) => {
        try {
            const token = req.headers['authorization'].replace('Bearer ', '')
            const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
            const payload = jwt.verify(token, secret_key)
            const member_id = payload.id

            const member = await prisma.member.findFirst({
                where: {
                    id: member_id
                },
                select: {
                    name: true,
                    username: true,
                    image: true
                }
            })

            res.json(member)
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    },
    update: async (req, res) => {
        try {
            const { name, username, password } = req.body
            const token = req.headers['authorization'].replace('Bearer ', '')
            const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
            const payload = jwt.verify(token, secret_key)
            const member_id = payload.id

            const oldMember = await prisma.member.findFirst({
                where: {
                    id: member_id
                }
            })

            let imageName = oldMember.image
            if (req.files && req.files.image) {
                const img = req.files.image
                const ext = path.extname(img.name)
                imageName = 'avatar_' + member_id + '_' + Date.now() + ext
                const uploadPath = path.join(__dirname, '../uploads', imageName)
                await img.mv(uploadPath)
            }

            let hashedPassword = oldMember.password
            if (password && password.trim() !== '') {
                hashedPassword = await bcrypt.hash(password, 10)
            }

            await prisma.member.update({
                data: {
                    name: name,
                    username: username,
                    password: hashedPassword,
                    image: imageName
                },
                where: {
                    id: member_id
                }
            })

            res.json({ message: 'success', image: imageName })
        } catch (err) {
            console.log(err) 
            res.status(500).json({ error: err.message })
        }
    },
    uploadProfile: async (req, res) => {
        try {
            const token = req.headers['authorization'].replace('Bearer ', '')
            const secret_key = process.env.SECRET_KEY || "defaultSecretKey"
            const payload = jwt.verify(token, secret_key)
            const member_id = payload.id

            if (!req.files || !req.files.image) {
                return res.status(400).json({ message: 'No file uploaded' })
            }

            const img = req.files.image
            const ext = path.extname(img.name)
            const imageName = 'avatar_' + member_id + '_' + Date.now() + ext
            const uploadPath = path.join(__dirname, '../uploads', imageName)
            await img.mv(uploadPath)

            await prisma.member.update({
                data: { image: imageName },
                where: { id: member_id }
            })

            res.json({ message: 'success', image: imageName })
        } catch (err) {
            res.status(500).json({ error: err.message })
        }
    }
}

module.exports = MemberController