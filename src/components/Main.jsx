import { useState } from "react";
import html2pdf from "html2pdf.js";
import otwarte from "../assets/zadania-otwarte.json";

export default function Main() {
  const lata = [...new Set(otwarte.map((zadanie) => zadanie.rok))];

  const [wybraneZadania, setWybraneZadania] = useState([]);
  const [poziom, setPoziom] = useState("podstawowy");
  const [iloscZadan, setIloscZadan] = useState(3);
  const [wybraneLata, setWybraneLata] = useState(lata);

  const tresciZadan = otwarte
    .filter((zadanie) => zadanie.poziom === poziom)
    .map((zadanie) => zadanie.tresc);

  function losujLiczby(n) {
    const wylosowaneLiczby = new Set();
    while (wylosowaneLiczby.size < n) {
      wylosowaneLiczby.add(Math.floor(Math.random() * tresciZadan.length));
    }
    return [...wylosowaneLiczby];
  }

  function wybierzLosoweZadanie() {
    const numeryZadan = losujLiczby(iloscZadan);
    const wylosowaneZadania = tresciZadan.filter((zadanie, indeks) =>
      numeryZadan.includes(indeks),
    );
    return setWybraneZadania(wylosowaneZadania);
  }

  function wyswietlZadania() {
    return wybraneZadania.map((zadanie) => (
      <li className="zadanie">{zadanie}</li>
    ));
  }

  function zapiszZadania() {
    const element = document.getElementById("tresciZadan");

    const opcje = {
      margin: 10,
      filename: "losowe-zadania-maturalne.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    };

    html2pdf().set(opcje).from(element).save();
  }

  return (
    <main>
      <div className="form-dropdown">
        <label className="form-label" htmlFor="poziom">
          Wybierz poziom
        </label>
        <select
          name="poziom"
          id="poziom"
          value={poziom}
          onChange={(e) => setPoziom(e.target.value)}
        >
          <option className="dropdown-option" value="">
            Wybierz poziom
          </option>

          <option className="dropdown-option" value="podstawowy">
            Podstawowy
          </option>
          <option className="dropdown-option" value="rozszerzony">
            Rozszerzony
          </option>
        </select>
      </div>
      <div className="form-dropdown">
        <label className="form-label" htmlFor="ilosc-zadan">
          Wybierz ilość pytań
        </label>
        <select
          name="ilosc-zadan"
          id="ilosc-zadan"
          value={iloscZadan}
          onChange={(e) => setIloscZadan(e.target.value)}
        >
          {Array.from({ length: 5 }).map((num, idx) => (
            <option key={idx} className="dropdown-option" value={idx + 1}>
              {idx + 1}
            </option>
          ))}
        </select>
      </div>
      <div className="form-dropdown">
        <label className="form-label" htmlFor="lata">
          Wybierz lata matur
        </label>
        <select
          name="lata"
          id="lata"
          value={wybraneLata}
          onChange={(e) => setWybraneLata(e.target.value)}
        >
          <option value="" disabled>
            Wybierz lata matur
          </option>
          {lata.map((rok) => (
            <option className="dropdown-option" value={rok}>
              {rok}
            </option>
          ))}
        </select>
      </div>

      <button className="btn" onClick={wybierzLosoweZadanie}>
        Generuj zadania
      </button>
      <button className="btn">Ukryj zadania</button>
      <div className="tresciZadan" id="tresciZadan">
        <ol>{wyswietlZadania()}</ol>
      </div>

      <button className="btn" onClick={() => zapiszZadania(wybraneZadania)}>
        Zapisz pdf z zadaniami
      </button>
    </main>
  );
}
