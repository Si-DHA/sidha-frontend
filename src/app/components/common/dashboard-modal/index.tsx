import { useState } from 'react';

interface ModalProps {
  title: string;
  data: any[];
}

const Modal: React.FC<ModalProps> = ({ title, data }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="btn">{title}</button>
      {isOpen && (
        <div className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
          <div className="modal-overlay absolute w-full h-full bg-gray-900 opacity-50"></div>

          <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
            <div className="modal-close absolute top-0 right-0 cursor-pointer flex flex-col items-center mt-4 mr-4 text-white text-sm z-50">
              <svg
                onClick={() => {
                  setIsOpen(false);
          
                }}
                className="fill-current text-white"
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 18 18"
              >
                <path
                  fillRule="evenodd"
                  d="M16.47 1.47a.75.75 0 011.06 1.06L9.06 9l8.47 8.47a.75.75 0 11-1.06 1.06L8 10.06l-8.47 8.47a.75.75 0 01-1.06-1.06L6.94 9 .47 1.47a.75.75 0 111.06-1.06L8 7.94l6.47-6.47a.75.75 0 011.06 0z"
                ></path>
              </svg>
            </div>

            <div className="modal-content py-4 text-left px-6">
              <div className="modal-header">
                <h1 className="modal-title text-lg font-semibold">{title}</h1>
              </div>

              <div className="modal-body">
                <table>
                  <thead>
                    <tr>
                      {Object.keys(data[0]).map((key) => (
                        <th key={key}>{key}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((row, index) => (
                      <tr key={index}>
                        {Object.values(row).map((value: any, i) => (
                          <td key={i}>{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="modal-footer">
                <button onClick={() => {
                  setIsOpen(false);
                }} className="btn">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
