import { useState, useEffect, createRef } from "react";
import Spreadsheet from "react-spreadsheet";


export default function App() {
  const [file, setFile] = useState();
  const [csvData, setcsvData] = useState();
  const [drag, setDrag] = useState(false);
  const [tableData, setTable] = useState();


  let dropRef = createRef();
  let dragCounter = 0;



  const fileReader = new FileReader();

  const createData = (initialData) => {
    if (!initialData) return


    //const keys = [...Object.keys(Object.assign({}, ...initialData))].reduce((acc, cur) => [...acc, { value: cur }], [])
    const keys = [...Object.keys(...initialData)].reduce((acc, cur) => [...acc, { value: cur }], [])

    return initialData.reduce((acc, cur) => {
      const temp = [...Object.values({ ...cur })].reduce((acc2, cur2) => [...acc2, { value: cur2 }], [])
      return [...acc, temp]
    }, [[...keys]])
  }



  const handleOnChange = (e) => {
    setFile(e.target.files[0]);
  };

  const CSVToJSON = (data, delimiter = ';') => {
    const titles = data.slice(0, data.indexOf('\n')).split(delimiter);
    return data
      .slice(data.indexOf('\n') + 1)
      .split('\n')
      .map(v => {
        const values = v.split(delimiter);
        return titles.reduce(
          (obj, title, index) => ((obj[title] = values[index]), obj),
          {}
        );
      });
  };


  const handleOnSubmit = e => {
    e.preventDefault();


    if (file) {
      fileReader.onload = function (event) {
        const text = event.target.result;
        const json = CSVToJSON(text, ",");
        setcsvData(json);

        console.log("console especial", json);

      };

      fileReader.readAsText(file);
    }
  };


  const addLine = e => {
    console.log("eu sou um botão")
    setcsvData([...csvData, { id: "1", nome: "luana", telefone: 7647345347 }])
    setTable([...csvData, {}])
  };

  useEffect(() => {
    console.log("eu sou um csvData", csvData)
  }, [csvData]);


  const handleDrag = e => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragIn = e => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter++;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) setDrag(true);
  };

  const handleDragOut = e => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter--;
    if (dragCounter === 0) setDrag(false);
  };

  const handleDrop = e => {
    e.preventDefault();
    e.stopPropagation();
    setDrag(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0]);

      e.dataTransfer.clearData();
      dragCounter = 0;
    }
  };

  useEffect(() => {
    let div = dropRef.current;
    div.addEventListener('dragenter', handleDragIn);
    div.addEventListener('dragleave', handleDragOut);
    div.addEventListener('dragover', handleDrag);
    div.addEventListener('drop', handleDrop);
    return () => {
      div.removeEventListener('dragenter', handleDragIn);
      div.removeEventListener('dragleave', handleDragOut);
      div.removeEventListener('dragover', handleDrag);
      div.removeEventListener('drop', handleDrop);
    };
  });

  useEffect(() => {
    setTable(createData(csvData))
  }, [csvData]);


  return (
    <div style={{ textAlign: "center" }}>
      <h1>REACTJS CSV IMPORT EXAMPLE </h1>
      <form>
        <input
          type={"file"}
          id={"csvFileInput"}
          accept={".csv"}
          onChange={handleOnChange}
        />
        <div ref={dropRef} style={{ backgroundColor: "blue", width: 90, height: 90 }} />



        <button
          onClick={e => handleOnSubmit(e)}
        >
          IMPORT CSV
        </button>
      </form>

      <br />
      {tableData && <Spreadsheet data={tableData} onChange={setTable} />}
      <button
        onClick={e => addLine(e)}
      >
        Adicionar de forma fácil
      </button>

    </div>
  );
}
