console.log("Connected");

const fileInput = document.getElementById("file-selector");
const output = {};
const outputArr = [];
const ordersArr = [];

const dateTimeString = new Date().toLocaleString();

const tbodyDom = document.getElementById("table-body");

const readFile = function () {
  const reader = new FileReader();
  reader.onload = function () {
    const lines = reader.result.split("\n");
    const headerLine = lines[0].split(",");
    console.log(
      "Target columns: ",
      headerLine,
      headerLine[1],
      headerLine[16],
      headerLine[17]
    );

    lines.forEach((line, index) => {
      if (index > 0) {
        let lineArr = line.split(",");
        let productName = lineArr[17];
        let quantity = Number(lineArr[16]);
        let orderNumber = lineArr[0];

        if (!productName) {
          return;
        }

        if (output[productName]) {
          output[productName].quantity += quantity;
          output[productName].orders += `     ${orderNumber}`;
        } else {
          output[productName] = { quantity: 0, orders: "" };
          output[productName].quantity = quantity;
          output[productName].orders = orderNumber;
        }
      }
    });

    // sort output object by key name alphabetically
    const keys = Object.keys(output);
    const sortedKeys = keys.sort((a, b) => {
      return (a > b) - 0.5;
    });

    // flat the structure, conver output object to array for futhur csv export
    sortedKeys.forEach((key) => {
      let tempArr = [key, output[key].quantity, output[key].orders];
      outputArr.push(tempArr);
    });

    outputArr.forEach((el) => {
      let tr = document.createElement("tr");
      let td_name = document.createElement("td");
      let name = el[0];
      td_name.innerHTML = name;
      let td_qty = document.createElement("td");
      td_qty.innerHTML = el[1];
      let td_orders = document.createElement("td");
      td_orders.innerHTML = el[2];
      tr.appendChild(td_name);
      tr.appendChild(td_qty);
      tr.appendChild(td_orders);
      tbodyDom.appendChild(tr);
    });

    exportToCsv(outputArr);
  };
  // start reading the file. When it is done, calls the onload event defined above.
  reader.readAsText(fileInput.files[0]);
};

const exportToCsv = function (results) {
  let csvString = "";

  results.unshift(["Product Name", "Qty", "Orders"]);

  results.forEach(function (rowItem, rowIndex) {
    rowItem.forEach(function (colItem, colIndex) {
      csvString += colItem + ",";
    });
    csvString += "\r\n";
  });
  csvString =
    "data:text/csv;charset=utf-8,\uFEFF" + encodeURIComponent(csvString);
  const x = document.getElementById("download-btn");
  x.setAttribute("href", csvString);
  x.setAttribute("download", `Newnorth Sales Data ${dateTimeString}.csv`);
  x.classList.add("is-primary");
  x.removeAttribute("disabled");
};

fileInput.addEventListener("change", readFile);

function printData() {
  const divToPrint = document.getElementById("output-table");
  newWin = window.open("");
  newWin.document.write(divToPrint.outerHTML);
  newWin.print();
  newWin.close();
}

const printBtn = document.getElementById("print-btn");
// printBtn.addEventListener("click", printData)
