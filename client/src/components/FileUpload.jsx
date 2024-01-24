import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios'
import {
  MdOutlineClose,
  MdOutlineCloudUpload,
  MdOutlineInsertDriveFile,
} from 'react-icons/md'
import { useDropzone } from 'react-dropzone'
import Progress from './Progress'

const FileUpload = () => {
  const [file, setFile] = useState(null)
  const [filename, setFilename] = useState('Choose File')
  const fileInputRef = useRef(null)
  const [data, setData] = useState([])
  const [uploadPercentage, setUploadPercentage] = useState(0)
  const [showProgressBar, setShowProgressBar] = useState(false)

  useEffect(() => {
    getfilesData()
  }, [data])

  const getfilesData = async () => {
    try {
      const res = await axios.get('http://localhost:5000/files/')

      setData(res.data)
    } catch (error) {
      console.log(error.data)
    }
  }

  const onChange = (e) => {
    if (e.target.files.length !== 0) {
      setFile(e.target.files[0])
      setFilename(e.target.files[0].name)
    } else {
      setFilename('Choose File')
    }
  }

  const onClickChooseFile = () => {
    fileInputRef.current.click()
  }

  const onClickDeleteFile = async (id) => {
    try {
      const res = await axios.delete(`http://localhost:5000/files/delete/${id}`)
      console.log(res.data.msg)
    } catch (error) {
      console.log(error.data)
    } finally {
      setFile(null)
      setFilename('Choose File')
    }
  }

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0]

    if (acceptedFiles.length !== 0) {
      setFile(file)
      setFilename(file.name)
    } else {
      setFilename('Choose File')
    }
  }

  const { getInputProps, getRootProps } = useDropzone({
    onDrop,
    noClick: true,
  })

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('file', file)

    try {
      setShowProgressBar(true)
      const res = await axios.post(
        'http://localhost:5000/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            setUploadPercentage(
              parseInt(
                Math.round(progressEvent.loaded * 100) / progressEvent.total
              )
            )
          },
        }
      )
      console.log(res.data.msg)
    } catch (error) {
      console.log(error.data)
    } finally {
      setShowProgressBar(false)
      setUploadPercentage(0)
      setFile(null)
      setFilename('Choose File')
    }
  }

  return (
    <div className="flex items-center justify-center flex-col min-h-screen bg-slate-100">
      <div className="py-6 space-y-5 xl:w-[1280px] w-[90%]">
        <div className="bg-white shadow-md rounded-md p-6 max-h-[500px] overflow-y-auto inset-0">
          <div className="mb-4 font-semibold uppercase text-slate-500 ">
            Uploader Files App
          </div>
          <form onSubmit={onSubmit}>
            <div
              {...getRootProps()}
              className="flex items-center justify-center border border-dashed h-[180px] border-slate-200 rounded-md pl-2"
            >
              <input {...getInputProps()} />
              <div className="flex flex-col items-center">
                <MdOutlineCloudUpload
                  onClick={onClickChooseFile}
                  className="w-16 h-16  cursor-pointer text-slate-400 hover:text-slate-500"
                />
                <p className="line-clamp-1">
                  Drag & drop a file here, or click to select a file
                </p>
              </div>
            </div>

            {showProgressBar ? (
              <Progress percentage={uploadPercentage} />
            ) : (
              file && (
                <div className="mt-4 border border-slate-200 rounded-md p-2 ">
                  <div className="line-clamp-1">{filename}</div>
                </div>
              )
            )}

            <div className="mb-4 max-h-[240px] overflow-auto">
              {data.map((file, index) => (
                <div
                  key={index}
                  className="my-4 last-of-type:mb-0 p-2 rounded-md flex items-center justify-between bg-slate-100 text-slate-500"
                >
                  <div>
                    <MdOutlineInsertDriveFile className="w-6 h-6 text-slate-400 hover:text-slate-500" />
                  </div>
                  <div className="line-clamp-1 mx-2 flex-1">
                    {file.originalName}
                  </div>
                  <div>
                    <MdOutlineClose
                      onClick={() => {
                        onClickDeleteFile(file._id)
                      }}
                      className="w-6 h-6 cursor-pointer text-slate-400 hover:text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {file ? (
              <button
                type="submit"
                className="bg-blue-500 text-slate-100 py-2 w-full uppercase font-medium rounded-md"
              >
                Upload
              </button>
            ) : (
              <button
                type="submit"
                disabled
                className="bg-blue-500 text-slate-100 py-2 w-full uppercase font-medium rounded-md"
              >
                Upload
              </button>
            )}
          </form>
        </div>
        <div className="bg-white shadow-md rounded-md p-6 max-h-[500px] overflow-y-auto inset-0">
          <div className="mb-4 font-semibold uppercase text-slate-500 ">
            Uploader Files App
          </div>
          <form onSubmit={onSubmit}>
            <div className="flex items-center justify-between border border-slate-200 rounded-md pl-2">
              <input
                type="file"
                onChange={onChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <label className="line-clamp-1">{filename}</label>
              <button
                type="button"
                onClick={onClickChooseFile}
                className="px-3.5 p-2 bg-slate-200 text-slate-500"
              >
                Browse
              </button>
            </div>

            {showProgressBar && <Progress percentage={uploadPercentage} />}

            <div className="mb-4 max-h-[240px] overflow-auto">
              {data.map((file, index) => (
                <div
                  key={index}
                  className="my-4 last-of-type:mb-0 p-2 rounded-md flex items-center justify-between bg-slate-100 text-slate-500"
                >
                  <div>
                    <MdOutlineInsertDriveFile className="w-6 h-6 text-slate-400 hover:text-slate-500" />
                  </div>
                  <div className="line-clamp-1 mx-2 flex-1">
                    {file.originalName}
                  </div>
                  <div>
                    <MdOutlineClose
                      onClick={() => {
                        onClickDeleteFile(file._id)
                      }}
                      className="w-6 h-6 cursor-pointer text-slate-400 hover:text-slate-500"
                    />
                  </div>
                </div>
              ))}
            </div>

            {file ? (
              <button
                type="submit"
                className="bg-blue-500 text-slate-100 py-2 w-full uppercase font-medium rounded-md"
              >
                Upload
              </button>
            ) : (
              <button
                type="submit"
                disabled
                className="bg-blue-500 text-slate-100 py-2 w-full uppercase font-medium rounded-md"
              >
                Upload
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default FileUpload
