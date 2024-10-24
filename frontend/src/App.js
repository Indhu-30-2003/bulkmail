import { useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
export default function App() {
  const [msg, setmsg] = useState("");
  const [status, setstatus] = useState(false);
  const [emaillist, setemail] = useState([]);

  function handlemsg(event) {
    setmsg(event.target.value);
  }

  function send() {
    setstatus(true);
    axios
      .post("http://localhost:5000/sendmail", { msg: msg ,emaillist:emaillist })
      .then(function (data) {
        console.log(data);
        if (data.data == true) {
          alert("Email send successfully");
          setstatus(false);
        } else {
          alert("Email send failed");
        }
      });
  }

  function handlefile(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = function (event) {
      const data = event.target.result;
      const workbook = XLSX.read(data, { type: "binary" });
      const Sheetname = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[Sheetname];
      const emaillist = XLSX.utils.sheet_to_json(worksheet, { header: "A" });
      const totalemail = emaillist.map(function (item) {
        return item.A;
      });
      console.log(totalemail)
      setemail(totalemail)
    };

    reader.readAsBinaryString(file);
  }

  return (
    <>
      <div>
        <div className="bg-blue-950 text-white text-center ">
          <h1 className="text-2xl font-medium px-3 py-3">BulkMail</h1>
        </div>
        <div className="bg-blue-800 text-white text-center ">
          <h1 className=" font-medium px-3 py-3">
            We can help your business with sending multiple emails at once
          </h1>
        </div>
        <div className="bg-blue-950 text-white text-center ">
          <h1 className=" font-medium px-3 py-3">Drag and Drop</h1>
        </div>
        <div className="bg-blue-400 flex flex-col items-center text-black px-5 py-3">
          <textarea
            className="w-[80%] h-32 py-2 outline-none px-2 border  border-black rounded-md "
            placeholder="Enter the email text"
            onChange={handlemsg}
            value={msg}
          ></textarea>
          <div>
            <input
              type="file"
              className="border-4 border-dashed  py-4 px-4 mt-5 mb-5 "
              onChange={handlefile}
            ></input>
          </div>
          <p>Total Emails in the file :{emaillist.length}</p>
          <button
            className="bg-blue-950 px-2 py-2 text-white font-medium rounded-md w-fit mt-2"
            onClick={send}
          >
            {status ? "Sending..." : "send"}
          </button>
        </div>
        <div className="bg-blue-300 text-white text-center p-8"></div>
        <div className="bg-blue-200 text-white text-center p-8"></div>
      </div>
    </>
  );
}
