import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { createPortal } from "react-dom";
import axios from "axios";
import {
  FileText,
  Trash2,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Search,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  Loader,
} from "lucide-react";
import "./MyRequests.css";

function MyRequests() {
  const user = useSelector((state) => state.auth.user);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userRequests, setUserRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/demandes";

  useEffect(() => {
    fetchUserRequests();
  }, [user?.id]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  const fetchUserRequests = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(API);
      const filteredRequests = response.data.filter(
        (req) => req.userId === user?.id || req.userId === user?.userId,
      );
      setUserRequests(filteredRequests);
    } catch (err) {
      setError("Erreur lors du chargement de vos demandes");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRequest = async (requestId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette demande?")) {
      return;
    }

    try {
      await axios.delete(`${API}/${requestId}`);
      setUserRequests(userRequests.filter((req) => req.id !== requestId));
      setSelectedRequest(null);
    } catch (err) {
      console.error("Erreur lors de la suppression:", err);
      setError("Erreur lors de la suppression de la demande");
    }
  };

  const getStatusIcon = (status) => {
    const statusUpper = (status || "").toUpperCase();
    switch (statusUpper) {
      case "PENDING":
        return <Clock size={16} />;
      case "APPROVED":
        return <CheckCircle size={16} />;
      case "REJECTED":
        return <XCircle size={16} />;
      default:
        return <FileText size={16} />;
    }
  };

  const getStatusLabel = (status) => {
    const statusUpper = (status || "").toUpperCase();
    switch (statusUpper) {
      case "PENDING":
        return "En attente";
      case "APPROVED":
        return "Approuvée";
      case "REJECTED":
        return "Rejetée";
      default:
        return status;
    }
  };

  const getStatusColor = (status) => {
    const statusUpper = (status || "").toUpperCase();
    switch (statusUpper) {
      case "PENDING":
        return "pending";
      case "APPROVED":
        return "approved";
      case "REJECTED":
        return "rejected";
      default:
        return "";
    }
  };

  const filteredRequests = userRequests.filter((req) => {
    const matchesSearch =
      req.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.id?.includes(searchTerm);

    const status = (req.status || "PENDING").toUpperCase();
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "pending" && status === "PENDING") ||
      (filterStatus === "approved" && status === "APPROVED") ||
      (filterStatus === "rejected" && status === "REJECTED");

    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginatedRequests = filteredRequests.slice(
    startIdx,
    startIdx + itemsPerPage,
  );

  const pendingCount = userRequests.filter(
    (r) => (r.status || "").toUpperCase() === "PENDING",
  ).length;
  const approvedCount = userRequests.filter(
    (r) => (r.status || "").toUpperCase() === "APPROVED",
  ).length;
  const rejectedCount = userRequests.filter(
    (r) => (r.status || "").toUpperCase() === "REJECTED",
  ).length;

  if (loading) {
    return (
      <div className="myrequests-container">
        <div className="loading-state">
          <Loader size={40} className="spinner" />
          <p>Chargement de vos demandes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="myrequests-container">
      <div className="myrequests-header">
        <div className="header-top">
          <div className="header-title">
            <FileText size={28} className="header-icon" />
            <div>
              <h1>Mes Demandes</h1>
              <p className="header-subtitle">
                Suivez et gérez vos demandes en un seul endroit
              </p>
            </div>
          </div>
        </div>

        <div className="header-stats">
          <div className="stat-card total">
            <div className="stat-icon">
              <FileText size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Total</span>
              <span className="stat-value">{userRequests.length}</span>
            </div>
          </div>
          <div className="stat-card pending">
            <div className="stat-icon">
              <Clock size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">En attente</span>
              <span className="stat-value">{pendingCount}</span>
            </div>
          </div>
          <div className="stat-card approved">
            <div className="stat-icon">
              <CheckCircle size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Approuvées</span>
              <span className="stat-value">{approvedCount}</span>
            </div>
          </div>
          <div className="stat-card rejected">
            <div className="stat-icon">
              <XCircle size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">Rejetées</span>
              <span className="stat-value">{rejectedCount}</span>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Rechercher par titre, description ou ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterStatus === "all" ? "active" : ""}`}
            onClick={() => setFilterStatus("all")}>
            Tous ({userRequests.length})
          </button>
          <button
            className={`filter-btn ${filterStatus === "pending" ? "active" : ""}`}
            onClick={() => setFilterStatus("pending")}>
            En attente ({pendingCount})
          </button>
          <button
            className={`filter-btn ${filterStatus === "approved" ? "active" : ""}`}
            onClick={() => setFilterStatus("approved")}>
            Approuvées ({approvedCount})
          </button>
          <button
            className={`filter-btn ${filterStatus === "rejected" ? "active" : ""}`}
            onClick={() => setFilterStatus("rejected")}>
            Rejetées ({rejectedCount})
          </button>
        </div>
      </div>

      <div className="table-wrapper">
        {filteredRequests.length === 0 ? (
          <div className="empty-state">
            <FileText size={56} className="empty-icon" />
            <h3>Aucune demande trouvée</h3>
            <p>
              {userRequests.length === 0
                ? "Vous n'avez pas encore créé de demandes."
                : "Aucun résultat ne correspond à votre recherche."}
            </p>
          </div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => (
                <tr key={request.id}>
                  <td>
                    <span
                      className="titre"
                      data-tooltip={request.titre}
                      title={request.titre}>
                      {request.titre}
                    </span>
                  </td>
                  <td>
                    <span
                      className="description"
                      data-tooltip={request.description}
                      title={request.description}>
                      {request.description}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-badge status-${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      {getStatusLabel(request.status)}
                    </span>
                  </td>
                  <td>
                    <span className="date">
                      {new Date(request.createdAt).toLocaleDateString("fr-FR", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </td>
                  <td>
                    <div className="actions-cell">
                      <button
                        className="btn-action btn-view"
                        onClick={() => setSelectedRequest(request)}
                        title="Voir les détails">
                        <Eye size={14} />
                      </button>
                      <button
                        className="btn-action btn-delete"
                        onClick={() => handleDeleteRequest(request.id)}
                        title="Supprimer">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {filteredRequests.length > 0 && (
        <div className="pagination">
          <button
            className="btn-pagination"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}>
            <ChevronLeft size={18} />
          </button>
          <span className="pagination-info">
            {currentPage} / {totalPages}
          </span>
          <button
            className="btn-pagination"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}>
            <ChevronRight size={18} />
          </button>
        </div>
      )}

      {selectedRequest &&
        createPortal(
          <div
            className="modal-overlay"
            onClick={() => setSelectedRequest(null)}>
            <div className="details-panel" onClick={(e) => e.stopPropagation()}>
              <div className="details-header">
                <h2>{selectedRequest.titre}</h2>
                <button
                  className="btn-close"
                  onClick={() => setSelectedRequest(null)}>
                  <X size={24} />
                </button>
              </div>

              <div className="details-content">
                <div className="detail-section">
                  <h4>
                    <Info size={16} /> Statut
                  </h4>
                  <div
                    className={`status-display status-${getStatusColor(selectedRequest.status)}`}>
                    {getStatusIcon(selectedRequest.status)}
                    <span>{getStatusLabel(selectedRequest.status)}</span>
                  </div>
                </div>

                <div className="detail-section">
                  <h4>
                    <FileText size={16} /> Description
                  </h4>
                  <p className="description-text">
                    {selectedRequest.description}
                  </p>
                </div>

                <div className="detail-section">
                  <h4>
                    <AlertCircle size={16} /> Informations
                  </h4>
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Date de création</label>
                      <span>
                        {new Date(selectedRequest.createdAt).toLocaleDateString(
                          "fr-FR",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                    <div className="info-item">
                      <label>ID de la demande</label>
                      <span>{selectedRequest.id}</span>
                    </div>
                  </div>
                </div>

                {(selectedRequest.status || "").toUpperCase() === "PENDING" && (
                  <div className="detail-section status-info pending-info">
                    <Clock size={18} />
                    <p>
                      Votre demande est en attente de traitement. Nous vous
                      notifierons dès qu'elle sera traitée.
                    </p>
                  </div>
                )}

                {(selectedRequest.status || "").toUpperCase() ===
                  "REJECTED" && (
                  <div className="detail-section status-info rejected-info">
                    <XCircle size={18} />
                    <p>
                      Votre demande a été rejetée. Vous pouvez créer une
                      nouvelle demande si vous le souhaitez.
                    </p>
                  </div>
                )}

                {(selectedRequest.status || "").toUpperCase() ===
                  "APPROVED" && (
                  <div className="detail-section status-info approved-info">
                    <CheckCircle size={18} />
                    <p>Félicitations! Votre demande a été approuvée.</p>
                  </div>
                )}

                <div className="details-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => setSelectedRequest(null)}>
                    Fermer
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => {
                      handleDeleteRequest(selectedRequest.id);
                    }}>
                    <Trash2 size={16} />
                    Supprimer cette demande
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

export default MyRequests;
