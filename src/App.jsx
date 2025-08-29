import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function FloristCostCalculator() {
  const [items, setItems] = useState([{ name: "", cost: "", markup: "", retail: "" }]);
  const captureRef = useRef(null);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    if (field === "cost" || field === "markup") {
      const cost = parseFloat(updatedItems[index].cost);
      const markup = parseFloat(updatedItems[index].markup);
      if (!isNaN(cost) && !isNaN(markup)) {
        updatedItems[index].retail = (cost * (1 + markup / 100)).toFixed(2);
      }
    }
    setItems(updatedItems);
  };

  const addItem = () => {
    setItems([...items, { name: "", cost: "", markup: "", retail: "" }]);
  };

  const exportToPDF = async () => {
    const canvas = await html2canvas(captureRef.current);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
    pdf.save("cost-analysis.pdf");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Posy Profits Cost Calculator</h1>
      <div ref={captureRef}>
        {items.map((item, index) => (
          <Card key={index}>
            <CardContent className="grid grid-cols-4 gap-4 p-4">
              <Input placeholder="Item Name" value={item.name} onChange={(e) => handleChange(index, "name", e.target.value)} />
              <Input placeholder="Cost" type="number" value={item.cost} onChange={(e) => handleChange(index, "cost", e.target.value)} />
              <Input placeholder="Markup %" type="number" value={item.markup} onChange={(e) => handleChange(index, "markup", e.target.value)} />
              <Input placeholder="Retail" value={item.retail} readOnly />
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="space-x-4">
        <Button onClick={addItem}>Add Item</Button>
        <Button onClick={exportToPDF}>Export to PDF</Button>
      </div>
    </div>
  );
}