import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Page } from 'react-pdf';
import { Document as Doc } from 'react-pdf';
import { FaArrowLeft, FaFilePdf, FaDownload } from 'react-icons/fa';
import axios from 'axios';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';
import './Documents.css';
import { ApiUrlContext } from '../../App';

function Documents() {
  const { doctorName } = useParams();
  const navigate = useNavigate();
  const apiUrl = useContext(ApiUrlContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [doctor, setDoctor] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [pdfError, setPdfError] = useState(false);

  useEffect(() => {
    const fetchDoctorByName = async () => {
      try {
        setLoading(true);
        // Parse the doctor name from URL parameter (format: firstName_lastName)
        const [firstName, lastName] = doctorName.split('_');
        
        // Fetch doctor data from API
        const response = await axios.get(`${apiUrl}/doctor-api/doctors`);
        if (response.data && response.data.doctors) {
          const foundDoctor = response.data.doctors.find(
            doc => doc.FirstName.toLowerCase() === firstName.toLowerCase() && 
                  doc.LastName.toLowerCase() === lastName.toLowerCase()
          );
          
          if (foundDoctor) {
            setDoctor(foundDoctor);
            // If doctor has docs, set the PDF URL
            if (foundDoctor.docs) {
              setPdfUrl(`${apiUrl}/uploads/${foundDoctor.docs}`);
            } else {
              // Use a sample PDF if doctor has no documents
              setPdfUrl(`${apiUrl}/uploads/5d39976b-de24-4a7d-a5b1-b3d68fc5d6b6quote_catering.pdf`);
            }
          } else {
            setError('Doctor not found');
          }
        } else {
          setError('Failed to fetch doctor data');
        }
      } catch (err) {
        console.error('Error fetching doctor:', err);
        setError('Error loading doctor information');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorByName();
  }, [doctorName, apiUrl]);

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
    setPageNumber(1);
    setPdfError(false);
  }

  function onDocumentLoadError(error) {
    console.error('Error loading PDF:', error);
    setPdfError(true);
  }

  function changePage(offset) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  const handleGoBack = () => {
    navigate(-1);
  };

  const openPdfInNewTab = () => {
    if (pdfUrl) {
      window.open(pdfUrl, '_blank', 'noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="document-viewer">
        <div className="container">
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Loading document...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !pdfUrl) {
    return (
      <div className="document-viewer">
        <div className="container">
          <div className="error-state">
            <p>{error || "Document not found"}</p>
            <button className="btn-primary" onClick={handleGoBack}>
              <FaArrowLeft /> Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="document-viewer">
      <div className="document-header">
        <div className="container">
          <div className="document-controls">
            <button className="back-btn" onClick={handleGoBack}>
              <FaArrowLeft /> Go Back
            </button>
            <h2>
              {doctor ? `Dr. ${doctor.FirstName} ${doctor.LastName}'s Documents` : 'Doctor Documents'}
            </h2>
            <div className="document-actions">
              <button className="btn-outline" onClick={openPdfInNewTab}>
                <FaDownload /> Open in New Tab
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="pdf-container">
          {pdfError ? (
            <div className="pdf-error">
              <FaFilePdf className="error-icon" />
              <p>
                Failed to load PDF document. This could be due to CORS restrictions.
                <br />
                Please try using the "Open in New Tab" button instead.
              </p>
              <button className="btn-primary" onClick={openPdfInNewTab}>
                <FaDownload /> Open PDF in New Tab
              </button>
            </div>
          ) : (
            <>
              <Doc
                file={pdfUrl}
                onLoadSuccess={onDocumentLoadSuccess}
                onLoadError={onDocumentLoadError}
                loading={
                  <div className="pdf-loading">
                    <div className="loading-spinner"></div>
                    <p>Loading PDF...</p>
                  </div>
                }
                error={
                  <div className="pdf-error">
                    <FaFilePdf className="error-icon" />
                    <p>Failed to load PDF document</p>
                  </div>
                }
              >
                <Page 
                  pageNumber={pageNumber} 
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  scale={1.2}
                />
              </Doc>

              {numPages && (
                <div className="pdf-navigation">
                  <button 
                    className="btn-secondary" 
                    disabled={pageNumber <= 1} 
                    onClick={previousPage}
                  >
                    Previous
                  </button>
                  <p>
                    Page {pageNumber} of {numPages}
                  </p>
                  <button 
                    className="btn-secondary" 
                    disabled={pageNumber >= numPages} 
                    onClick={nextPage}
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Documents;


