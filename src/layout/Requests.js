import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  CheckCircle,
  XCircle,
  Search,
  Eye,
  Check,
  X,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNotificationHelper } from "./Usenotificationhelper";
import "./Requests.css";

function Requests() {
  const API = "https://6935e745fa8e704dafbf386c.mockapi.io/demandes";
  const user = useSelector((state) => state.auth.user);
  const notify = useNotificationHelper();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const itemsPerPage = 8;

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API);
      setRequests(res.data);
    } catch (err) {
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveRequest = async (requestId) => {
    try {
      await axios.put(`${API}/${requestId}`, {
        status: "APPROVED",
        approvedAt: new Date().toISOString(),
      });
      setRequests(
        requests.map((req) =>
          req.id === requestId
            ? {
                ...req,
                status: "APPROVED",
                approvedAt: new Date().toISOString(),
              }
            : req,
        ),
      );
      notify.success("✓ Demande approuvée avec succès");
    } catch (err) {
      notify.error("Erreur lors de l'approbation de la demande");
    }
  };

  const handleRejectRequest = async (requestId) => {
    try {
      await axios.put(`${API}/${requestId}`, { status: "REJECTED" });
      setRequests(
        requests.map((req) =>
          req.id === requestId ? { ...req, status: "REJECTED" } : req,
        ),
      );
      notify.error("✗ Demande rejetée");
    } catch (err) {
      notify.error("Erreur lors du rejet de la demande");
    }
  };

  const filteredRequests = requests.filter((req) => {
    const matchesSearch =
      req.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      req.userId?.includes(searchTerm);

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

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterStatus]);

  if (!user || !user.admin) {
    return (
      <div className="requests-container">
        <div className="access-denied">
          <AlertCircle size={48} />
          <h2>Accès refusé</h2>
          <p>Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    );
  }

  const pendingCount = requests.filter(
    (req) => (req.status || "PENDING").toUpperCase() === "PENDING",
  ).length;
  const approvedCount = requests.filter(
    (req) => (req.status || "").toUpperCase() === "APPROVED",
  ).length;
  const rejectedCount = requests.filter(
    (req) => (req.status || "").toUpperCase() === "REJECTED",
  ).length;

  return (
    <div className="requests-container">
      {/* Header */}
      <div className="requests-header">
        <h2>Demandes des Utilisateurs</h2>
      </div>

      {/* Stats */}
      <div className="stats-bar">
        <div className="stat-item">
          <span className="stat-label">En attente</span>
          <span className="stat-value pending">{pendingCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Approuvées</span>
          <span className="stat-value approved">{approvedCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Rejetées</span>
          <span className="stat-value rejected">{rejectedCount}</span>
        </div>
      </div>

      {/* Filters */}
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
            Tous ({requests.length})
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

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <div className="loading">Chargement des demandes...</div>
        ) : filteredRequests.length === 0 ? (
          <div className="no-data">Aucune demande trouvée</div>
        ) : (
          <table className="requests-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Description</th>
                <th>Utilisateur</th>
                <th>Statut</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedRequests.map((request) => {
                const status = (request.status || "PENDING").toUpperCase();
                const createdDate = new Date(request.createdAt);

                return (
                  <tr key={request.id}>
                    <td>
                      <span className="titre" data-tooltip={request.titre}>
                        {request.titre}
                      </span>
                    </td>
                    <td>
                      <span
                        className="description"
                        data-tooltip={request.description}>
                        {request.description}
                      </span>
                    </td>
                    <td>
                      <span className="user-id">ID: {request.userId}</span>
                    </td>
                    <td>
                      <span
                        className={`status-badge status-${status.toLowerCase()}`}>
                        {status === "PENDING" && "En attente"}
                        {status === "APPROVED" && "Approuvée"}
                        {status === "REJECTED" && "Rejetée"}
                      </span>
                    </td>
                    <td>
                      <span className="date">
                        {createdDate.toLocaleDateString("fr-FR", {
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
                        {status === "PENDING" && (
                          <>
                            <button
                              className="btn-action btn-approve"
                              onClick={() => handleApproveRequest(request.id)}
                              title="Approuver">
                              <Check size={14} />
                            </button>
                            <button
                              className="btn-action btn-reject"
                              onClick={() => handleRejectRequest(request.id)}
                              title="Rejeter">
                              <X size={14} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
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

      {/* Modal - Request Details */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedRequest.titre}</h3>
              <button
                className="btn-close"
                onClick={() => setSelectedRequest(null)}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h4>Description</h4>
                <p>{selectedRequest.description}</p>
              </div>

              <div className="modal-grid">
                <div className="modal-item">
                  <span className="label">ID Utilisateur</span>
                  <span className="value">{selectedRequest.userId}</span>
                </div>
                <div className="modal-item">
                  <span className="label">Statut</span>
                  <span
                    className={`status-badge status-${(
                      selectedRequest.status || "PENDING"
                    ).toLowerCase()}`}>
                    {selectedRequest.status === "PENDING" && "En attente"}
                    {selectedRequest.status === "APPROVED" && "Approuvée"}
                    {selectedRequest.status === "REJECTED" && "Rejetée"}
                  </span>
                </div>
                <div className="modal-item">
                  <span className="label">Date de création</span>
                  <span className="value">
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
                {selectedRequest.approvedAt && (
                  <div className="modal-item">
                    <span className="label">Date d'approbation</span>
                    <span className="value">
                      {new Date(selectedRequest.approvedAt).toLocaleDateString(
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
                )}
              </div>
            </div>

            {selectedRequest.status === "PENDING" && (
              <div className="modal-actions">
                <button
                  className="btn btn-approve"
                  onClick={() => {
                    handleApproveRequest(selectedRequest.id);
                    setSelectedRequest(null);
                  }}>
                  <CheckCircle size={18} />
                  Approuver
                </button>
                <button
                  className="btn btn-reject"
                  onClick={() => {
                    handleRejectRequest(selectedRequest.id);
                    setSelectedRequest(null);
                  }}>
                  <XCircle size={18} />
                  Rejeter
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Requests;
