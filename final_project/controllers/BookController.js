const { PrismaClient } = require('../generated/prisma/index.js')
const prisma = new PrismaClient()

const BookController = {
  list: async (req, res) => {
      const books = await prisma.book.findMany()
      res.json(books)
  },
  create: async (req, res) => {
      const book = await prisma.book.create({
          data: {
              name: req.body.name,
              price: req.body.price
          }
      })
      res.json({ book: book })
  },
  update: async (req, res) => {
      const book = await prisma.book.update({
          data: {
              name: req.body.name,
              price: req.body.price
          },
          where: {
              id: parseInt(req.params.id)
          }
      })
      res.json(book)
  },
    delete: async (req, res) => {
        await prisma.book.delete({
            where: {
                id: parseInt(req.params.id)
            }
        })
        res.json({ message: 'success' })
    }
}

module.exports = BookController;
ports = BookController;
