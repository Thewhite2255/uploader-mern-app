const File = require('../models/file.model')
const path = require('path')
const fs = require('fs').promises

const getFiles = async (req, res) => {
  const files = await File.find()

  if (!files) {
    return res.status(400).json({ msg: 'No files found' })
  }

  res.status(200).json(files)
}

const uploadFile = async (req, res) => {
  const file = req.files.file

  if (!file) {
    return res.status(400).json({ msg: 'file fields required' })
  }

  const filename = Date.now() + path.extname(file.name)
  const updatePath = path.join(__dirname, '..', 'public', 'uploads', filename)

  await file.mv(updatePath)

  const newFile = new File({
    filename,
    originalName: file.name,
    size: file.size,
    mimeType: file.mimetype,
    path: `uploads/${filename}`,
  })

  await newFile.save()

  res.status(200).json({ msg: 'Files uploaded successfully!' })
}

const deleteFile = async (req, res) => {
  const id = req.params.id

  if (!id) {
    return res.status(400).json({ msg: 'User ID required' })
  }

  const file = await File.findById(id)

  if (!file) {
    return res.status(400).json({ message: 'File not found' })
  }

  const deletePath = path.join(
    __dirname,
    '..',
    'public',
    'uploads',
    file.filename
  )

  await fs.unlink(deletePath)

  const result = await file.deleteOne()

  const reply = `File ${file.originalName} with ID ${file._id} deleted`

  res.json({ msg: reply })
}

module.exports = { getFiles, uploadFile, deleteFile }
