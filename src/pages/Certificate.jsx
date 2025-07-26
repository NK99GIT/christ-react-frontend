import { useEffect, useState, useRef } from "react";
import html2canvas from "html2canvas";
import { useParams } from "react-router-dom";

import awardImg from "../assets/Images/12390.jpg";
import Logo from "../assets/Images/logo-with-white.png";
import LogoWithouttext from "../assets/Images/logo-white.png";
import Logo2 from "../assets/Images/22.png";
import sign from "../assets/Images/sign1.png";
import QuestionServices from "../services/Question.services";

const Certificate = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const certificateRef = useRef(null);

  const { id, phone } = useParams();
 
  const quizId = atob(id);
  const userPhone = atob(phone);
  useEffect(() => {
    const fetchCertificate = async () => {
      try {
        const res = await QuestionServices.getCertificate(quizId, userPhone);
        setData(res);
      } catch (err) {
        setError("Unable to load certificate.");
      } finally {
        setLoading(false);
      }
    };
    fetchCertificate();
  }, []);

  const downloadCertificate = async () => {
    const element = certificateRef.current;
    if (!element) return;
    const canvas = await html2canvas(element, { scale: 2 });
    const dataURL = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = `Certificate-${data[0]?.name || "user"}.png`;
    link.click();
  };

  if (loading) {
    return <div style={{ textAlign: "center", padding: "40px" }}>Loading Certificate...</div>;
  }

  if (error || !data || data.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", color: "red", fontWeight: "600" }}>
        {error || "Certificate data not available."}
      </div>
    );
  }

  const certificate = data[0];

  return (
    <>
    <div className="bg-indigo-500 h-20"> 
      </div>
    <div 
      style={{
        marginTop: "30px",
        background: "#f3f4f6",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "auto", 
      }}
    >
      {/* Certificate (Fixed A4 Size: 1120x792) */}
      <div
        ref={certificateRef}
        style={{
          width: "1000px",
          height: "600px",
          backgroundColor: "#fff",
          padding: "60px 80px",
          position: "relative",
          border: "2px solid #d1d5db",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          overflow: "hidden",
          boxSizing: "border-box",
          
        }}
      >
        {/* Blue Ribbons */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "150px",
            backgroundColor: "#2563eb",
            transform: "skewY(0deg)",
            transformOrigin: "top left",
            zIndex: 0,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "100%",
            height: "40px",
            backgroundColor: "#2563eb",
            zIndex: 0,
          }}
        />

        {/* Logos and Headers */}
        <img src={LogoWithouttext} style={{ width: "100px", position: "absolute", top: 10, left: 20, zIndex: 10 }} alt="Logo" /> 
        <h2 className="text-white text-5xl absolute top-12 left-[300px] font-bold">FRIENDS IN CHRIST</h2> 
      
        <h2
          style={{
            position: "absolute",
            top: 80,
            left: "50%",
            transform: "translateX(-50%)",
            color: "#fff",
            fontSize: "36px",
            fontWeight: "800",
            letterSpacing: "2px",
            zIndex: 10,
          }}
        >
          
        </h2>

        {/* Main Body */}
        <div style={{ position: "relative", zIndex: 10, marginTop: "160px", textAlign: "center" }}>
            <h1
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            color: "#000",
            fontSize: "24px",
            fontWeight: "bold",
            zIndex: 10,
          }}
        >
          CERTIFICATE OF COMPLETION
        </h1>
          <p style={{ fontSize: "18px", color: "#374151" }}>This is to certify that</p>
          <h3 style={{ fontSize: "32px", fontWeight: "bold", color: "#111827", margin: "12px 0" }}>
            🎉 {certificate.name} 🎉
          </h3>
          <p style={{ fontSize: "16px", color: "#4b5563", maxWidth: "800px", margin: "0 auto", lineHeight: "1.6" }}>
            has successfully completed the quiz <strong>{certificate.quiz_title}</strong> with an
            outstanding score of <strong>{parseFloat(certificate.percentage).toFixed(0)}%</strong>. This
            certificate is awarded in recognition of exceptional achievement and commitment to
            learning.
          </p>
        </div>

        {/* Footer Info */}
        <div
          style={{
            position: "absolute",
            bottom: 60,
            left: 80,
            right: 80,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Date */}
          <div style={{ textAlign: "center" }}>
            <p style={{ fontWeight: "500", color: "#374151" }}>Date</p>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>
              {new Date(certificate.created_at).toLocaleDateString()}
            </p>
          </div>

          {/* Signature */}
          <div style={{ textAlign: "center" }}>
            <img src={sign} style={{ width: "100px", margin: "0 auto" }} alt="Signature" />
            <div
              style={{
                borderTop: "2px solid #6b7280",
                width: "160px",
                margin: "4px auto",
              }}
            />
            <p style={{ fontWeight: "500", color: "#374151" }}>Signature</p>
          </div>
        </div>
      </div>

      {/* Download Button */}
      <div className="absolute right-10 -top-2 ">
      <button
        onClick={downloadCertificate}
        style={{
          marginTop: "24px",
          backgroundColor: "#3AA757",
          color: "#fff",
          padding: "12px 24px",
          borderRadius: "8px",
          fontWeight: "bold",
          border: "none",
          cursor: "pointer",
        }}
      >
        Download Certificate
      </button>
      </div>
      <div className="absolute left-10 top-2 w-[180px] ">
      <img src={Logo} className="rounded-full w-full"/>
      </div>
    </div>

<div className="bg-white border w-[400px] mx-auto text-center">

</div>

    </>
  );
};

export default Certificate;
