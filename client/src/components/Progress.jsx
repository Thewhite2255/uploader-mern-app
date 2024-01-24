import React from 'react'
import PropTypes from 'prop-types'

const Progress = ({ percentage }) => {
  return (
    <div className="mt-4">
      <div className="relative">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
              Upload Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {percentage}%
            </span>
          </div>
        </div>
        <div className="flex h-2 overflow-hidden bg-slate-100 rounded">
          <div
            style={{ width: `${percentage}%` }}
            className="bg-blue-500"
          ></div>
        </div>
      </div>
    </div>
  )
}

Progress.propTypes = {
  percentage: PropTypes.number.isRequired,
}

export default Progress
