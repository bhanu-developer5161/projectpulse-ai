
import { useEffect, useState } from "react";

function App() {
  const [content, setContent] = useState("");
  const [source, setSource] = useState("client");
  const [message, setMessage] = useState("");

  const [communications, setCommunications] = useState([]);
  const [analysis, setAnalysis] = useState({});
  const [analyzingId, setAnalyzingId] = useState(null);

  const [dashboard, setDashboard] = useState({
    total_communications: 0,
    total_decisions: 0,
    total_action_items: 0,
    total_risks: 0,
  });

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all communications
  const fetchCommunications = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/communications/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch communications");
      }

      const data = await response.json();
      setCommunications(data);
    } catch (error) {
      console.error(
        "Failed to fetch communications:",
        error
      );
    }
  };

  // Fetch dashboard statistics
  const fetchDashboard = async () => {
    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/communications/dashboard/"
      );

      if (!response.ok) {
        throw new Error("Failed to fetch dashboard");
      }

      const data = await response.json();
      setDashboard(data);
    } catch (error) {
      console.error(
        "Failed to fetch dashboard:",
        error
      );
    }
  };

  // Load data when page opens
  useEffect(() => {
    fetchCommunications();
    fetchDashboard();
  }, []);

  // Add a new communication
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setMessage("Please enter a communication.");
      return;
    }

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/communications/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            content: content,
            source: source,
            summary: "",
            decisions: [],
            action_items: [],
            risks: [],
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to save communication");
      }

      setMessage("Communication added successfully!");
      setContent("");

      await fetchCommunications();
      await fetchDashboard();
    } catch (error) {
      console.error(
        "Failed to add communication:",
        error
      );

      setMessage("Failed to add communication.");
    }
  };

  // Analyze a communication
  const handleAnalyze = async (id) => {
    try {
      setAnalyzingId(id);
      setMessage("");

      const url =
        "http://127.0.0.1:8000/api/communications/" +
        id +
        "/analyze/";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData =
          await response.json().catch(() => null);

        throw new Error(
          errorData?.error || "Analysis failed"
        );
      }

      const data = await response.json();

      console.log("Analysis result:", data);

      setAnalysis((previous) => ({
        ...previous,
        [id]: data,
      }));

      await fetchCommunications();
      await fetchDashboard();
    } catch (error) {
      console.error("Analysis failed:", error);

      setMessage(
        "Failed to analyze communication: " +
          error.message
      );
    } finally {
      setAnalyzingId(null);
    }
  };

  // Search Project Memory
  const filteredCommunications =
    communications.filter((communication) => {
      const searchText = searchTerm
        .toLowerCase()
        .trim();

      if (!searchText) {
        return true;
      }

      const communicationContent =
        communication.content?.toLowerCase() || "";

      const communicationSource =
        communication.source?.toLowerCase() || "";

      const communicationSummary =
        communication.summary?.toLowerCase() || "";

      const decisions = Array.isArray(
        communication.decisions
      )
        ? communication.decisions
            .join(" ")
            .toLowerCase()
        : "";

      const actionItems = Array.isArray(
        communication.action_items
      )
        ? communication.action_items
            .map((item) => {
              return (
                (item.person || "") +
                " " +
                (item.task || "") +
                " " +
                (item.deadline || "")
              );
            })
            .join(" ")
            .toLowerCase()
        : "";

      const risks = Array.isArray(
        communication.risks
      )
        ? communication.risks
            .join(" ")
            .toLowerCase()
        : "";

      return (
        communicationContent.includes(searchText) ||
        communicationSource.includes(searchText) ||
        communicationSummary.includes(searchText) ||
        decisions.includes(searchText) ||
        actionItems.includes(searchText) ||
        risks.includes(searchText)
      );
    });

  // Convert action items into project tasks
  const tasks = communications.flatMap(
    (communication) => {
      if (
        !Array.isArray(
          communication.action_items
        )
      ) {
        return [];
      }

      return communication.action_items.map(
        (item) => {
          return {
            ...item,
            communicationId: communication.id,
          };
        }
      );
    }
  );

  return (
    <div>
      <h1>ProjectPulse AI</h1>

      <p>
        Make project communication intelligent, not
        overwhelming.
      </p>

      <hr />

      {/* Dashboard */}
      <h2>Project Dashboard</h2>

      <p>
        <strong>Communications:</strong>{" "}
        {dashboard.total_communications}
      </p>

      <p>
        <strong>Decisions:</strong>{" "}
        {dashboard.total_decisions}
      </p>

      <p>
        <strong>Action Items:</strong>{" "}
        {dashboard.total_action_items}
      </p>

      <p>
        <strong>Risks:</strong>{" "}
        {dashboard.total_risks}
      </p>

      <hr />

      {/* Add Communication */}
      <h2>Add Communication</h2>

      <form onSubmit={handleSubmit}>
        <label>
          <strong>Source</strong>
        </label>

        <br />

        <select
          value={source}
          onChange={(event) => {
            setSource(event.target.value);
          }}
        >
          <option value="whatsapp">WhatsApp</option>
          <option value="email">Email</option>
          <option value="site">Site Update</option>
          <option value="client">Client</option>
          <option value="supplier">Supplier</option>
        </select>

        <br />
        <br />

        <label>
          <strong>Communication</strong>
        </label>

        <br />

        <textarea
          value={content}
          onChange={(event) => {
            setContent(event.target.value);
          }}
          placeholder="Paste project communication here..."
          rows="8"
          cols="60"
        />

        <br />
        <br />

        <button type="submit">
          Add Communication
        </button>
      </form>

      {message && <p>{message}</p>}

      <hr />

      {/* Project Tasks */}
      <h2>Project Tasks</h2>

      {tasks.length === 0 ? (
        <p>No tasks identified yet.</p>
      ) : (
        <ul>
          {tasks.map((task, index) => (
            <li
              key={
                task.communicationId +
                "-" +
                index
              }
            >
              <strong>
                {task.task || "Task not specified"}
              </strong>

              <br />

              Responsible:{" "}
              {task.person || "Not specified"}

              <br />

              Deadline:{" "}
              {task.deadline || "Not specified"}
            </li>
          ))}
        </ul>
      )}

      <hr />

      {/* Project Memory */}
      <h2>Project Memory</h2>

      <input
        type="text"
        value={searchTerm}
        onChange={(event) => {
          setSearchTerm(event.target.value);
        }}
        placeholder="Search communications, decisions, tasks..."
        size="50"
      />

      <br />
      <br />

      <h2>Recent Communications</h2>

      {filteredCommunications.length === 0 ? (
        <p>
          {communications.length === 0
            ? "No communications yet."
            : "No matching communications found."}
        </p>
      ) : (
        filteredCommunications.map(
          (communication) => {
            const currentAnalysis =
              analysis[communication.id];

            const decisions =
              Array.isArray(
                currentAnalysis?.decisions
              )
                ? currentAnalysis.decisions
                : Array.isArray(
                    communication.decisions
                  )
                ? communication.decisions
                : [];

            const actionItems =
              Array.isArray(
                currentAnalysis?.action_items
              )
                ? currentAnalysis.action_items
                : Array.isArray(
                    communication.action_items
                  )
                ? communication.action_items
                : [];

            const risks =
              Array.isArray(
                currentAnalysis?.risks
              )
                ? currentAnalysis.risks
                : Array.isArray(
                    communication.risks
                  )
                ? communication.risks
                : [];

            const summary =
              currentAnalysis?.summary ||
              communication.summary ||
              "";

            return (
              <div key={communication.id}>
                <h3>
                  {communication.source}
                </h3>

                <p>{communication.content}</p>

                <small>
                  {new Date(
                    communication.created_at
                  ).toLocaleString()}
                </small>

                <br />
                <br />

                <button
                  onClick={() => {
                    handleAnalyze(
                      communication.id
                    );
                  }}
                  disabled={
                    analyzingId ===
                    communication.id
                  }
                >
                  {analyzingId ===
                  communication.id
                    ? "Analyzing..."
                    : "Analyze"}
                </button>

                {(currentAnalysis ||
                  summary ||
                  decisions.length > 0 ||
                  actionItems.length > 0 ||
                  risks.length > 0) && (
                  <div>
                    <h4>AI Analysis</h4>

                    <p>
                      <strong>
                        Summary:
                      </strong>{" "}
                      {summary ||
                        "No summary available."}
                    </p>

                    <p>
                      <strong>
                        Decisions:
                      </strong>
                    </p>

                    {decisions.length > 0 ? (
                      <ul>
                        {decisions.map(
                          (decision, index) => (
                            <li key={index}>
                              {decision}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No decisions identified.
                      </p>
                    )}

                    <p>
                      <strong>
                        Action Items:
                      </strong>
                    </p>

                    {actionItems.length > 0 ? (
                      <ul>
                        {actionItems.map(
                          (item, index) => (
                            <li key={index}>
                              {item.person ||
                                "Not specified"}{" "}
                              -{" "}
                              {item.task ||
                                "Task not specified"}{" "}
                              -{" "}
                              {item.deadline ||
                                "Not specified"}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No action items identified.
                      </p>
                    )}

                    <p>
                      <strong>
                        Risks:
                      </strong>
                    </p>

                    {risks.length > 0 ? (
                      <ul>
                        {risks.map(
                          (risk, index) => (
                            <li key={index}>
                              {risk}
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p>
                        No risks identified.
                      </p>
                    )}
                  </div>
                )}

                <hr />
              </div>
            );
          }
        )
      )}
    </div>
  );
}

export default App;

