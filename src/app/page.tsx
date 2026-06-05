"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { AUTH_USER } from "@/constants/auth";
import { companyForms, productVision } from "@/data/forms";

type Screen = "home" | "forms" | "pre-use" | "saved-detail";
type InspectionStatus = "ok" | "issue" | "na" | "";
type SavedInspection = {
  id: string;
  formId: string;
  formTitle: string;
  operator: string;
  turn: string;
  date: string;
  savedAt: string;
  completion: number;
  issueCount: number;
  responses: Record<number, InspectionStatus>;
  notes: Record<number, string>;
};

const SAVED_INSPECTIONS_KEY = "miller.savedInspections";

const statusLabels: Record<Exclude<InspectionStatus, "">, string> = {
  ok: "Cumple",
  issue: "Hallazgo",
  na: "No aplica",
};

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [screen, setScreen] = useState<Screen>("home");
  const [operator, setOperator] = useState<string>(AUTH_USER.name);
  const [turn, setTurn] = useState("T1");
  const [inspectionDate, setInspectionDate] = useState(new Date().toISOString().slice(0, 10));
  const [responses, setResponses] = useState<Record<number, InspectionStatus>>({});
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [savedInspections, setSavedInspections] = useState<SavedInspection[]>([]);
  const [selectedInspection, setSelectedInspection] = useState<SavedInspection | null>(null);

  const form = companyForms[0];
  const completedItems = useMemo(
    () => form.items.filter((item) => responses[item.id]).length,
    [form.items, responses],
  );
  const issueCount = useMemo(
    () => Object.values(responses).filter((response) => response === "issue").length,
    [responses],
  );
  const completion = Math.round((completedItems / form.items.length) * 100);

  useEffect(() => {
    const saved = window.localStorage.getItem(SAVED_INSPECTIONS_KEY);

    if (!saved) {
      return;
    }

    try {
      setSavedInspections(JSON.parse(saved) as SavedInspection[]);
    } catch {
      window.localStorage.removeItem(SAVED_INSPECTIONS_KEY);
    }
  }, []);

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = String(formData.get("username") ?? "");
    const password = String(formData.get("password") ?? "");

    if (username === AUTH_USER.username && password === AUTH_USER.password) {
      setIsLoggedIn(true);
      setLoginError("");
      return;
    }

    setLoginError("Usuario o contrasena invalida. Usa generic / generic.");
  }

  function updateResponse(itemId: number, value: InspectionStatus) {
    setResponses((current) => ({ ...current, [itemId]: value }));
  }

  function saveInspection() {
    const savedInspection: SavedInspection = {
      id: crypto.randomUUID(),
      formId: form.id,
      formTitle: form.title,
      operator,
      turn,
      date: inspectionDate,
      savedAt: new Date().toISOString(),
      completion,
      issueCount,
      responses,
      notes,
    };
    const nextSavedInspections = [savedInspection, ...savedInspections];

    setSavedInspections(nextSavedInspections);
    window.localStorage.setItem(SAVED_INSPECTIONS_KEY, JSON.stringify(nextSavedInspections));
    setResponses({});
    setNotes({});
    setScreen("forms");
  }

  function openSavedInspection(inspection: SavedInspection) {
    setSelectedInspection(inspection);
    setScreen("saved-detail");
  }

  if (!isLoggedIn) {
    return (
      <main className="login-page">
        <section className="login-card">
          <p className="eyebrow">Miller Operations</p>
          <h1>Ingreso a formularios digitales</h1>
          <p className="muted">
            Prototipo inicial para reemplazar archivos de inspeccion por registros trazables.
          </p>

          <form onSubmit={handleLogin} className="login-form">
            <label>
              Usuario
              <input name="username" 
              // placeholder="generic" 
              autoComplete="username" />
            </label>
            <label>
              Contrasena
              <input
                name="password"
                type="password"
                // placeholder="generic"
                autoComplete="current-password"
              />
            </label>
            {loginError ? <p className="error">{loginError}</p> : null}
            <button type="submit">Ingresar</button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div>
          <p className="eyebrow">Miller</p>
          <h2>Operaciones</h2>
        </div>

        <nav>
          <button className={screen === "home" ? "active" : ""} onClick={() => setScreen("home")}>
            Inicio
          </button>
          <button
            className={screen !== "home" ? "active" : ""}
            onClick={() => setScreen("forms")}
          >
            Formularios
          </button>
        </nav>

        <div className="user-card">
          <span>{AUTH_USER.role}</span>
          <strong>{AUTH_USER.name}</strong>
          <button
            onClick={() => {
              setIsLoggedIn(false);
              setScreen("home");
            }}
          >
            Cerrar sesion
          </button>
        </div>
      </aside>

      <section className="content">
        {screen === "home" ? (
          <HomeDashboard onOpenForms={() => setScreen("forms")} />
        ) : null}

        {screen === "forms" ? (
          <FormsList
            completion={completion}
            issueCount={issueCount}
            savedInspections={savedInspections}
            onOpenForm={() => setScreen("pre-use")}
            onViewSaved={openSavedInspection}
          />
        ) : null}

        {screen === "pre-use" ? (
          <section className="stack">
            <button className="ghost-button" onClick={() => setScreen("forms")}>
              Volver a formularios
            </button>

            <div className="hero-card">
              <div>
                <p className="eyebrow">Formulario digital</p>
                <h1>{form.title}</h1>
                <p className="muted">
                  {form.area} / {form.section} / {form.equipment}
                </p>
              </div>
              <div className="status-pill">{form.status}</div>
            </div>

            <div className="form-meta">
              <label>
                Operador
                <input value={operator} onChange={(event) => setOperator(event.target.value)} />
              </label>
              <label>
                Turno
                <select value={turn} onChange={(event) => setTurn(event.target.value)}>
                  <option>T1</option>
                  <option>T2</option>
                  <option>T3</option>
                </select>
              </label>
              <label>
                Fecha
                <input
                  type="date"
                  value={inspectionDate}
                  onChange={(event) => setInspectionDate(event.target.value)}
                />
              </label>
            </div>

            <div className="progress-card">
              <div>
                <strong>{completion}% completado</strong>
                <p>{completedItems} de {form.items.length} puntos inspeccionados</p>
              </div>
              <div>
                <strong>{issueCount} hallazgos</strong>
                <p>Se enviarian a plan de accion en la siguiente fase</p>
              </div>
            </div>

            <div className="inspection-list">
              {form.items.map((item) => (
                <article className="inspection-item" key={item.id}>
                  <div className="item-copy">
                    <span>Item {item.id} · Criticidad {item.criticality}</span>
                    <h3>{item.verify}</h3>
                    <p>{item.parameter}</p>
                  </div>

                  <div className="response-grid">
                    {(["ok", "issue", "na"] as const).map((value) => (
                      <button
                        key={value}
                        className={responses[item.id] === value ? "selected" : ""}
                        onClick={() => updateResponse(item.id, value)}
                      >
                        {statusLabels[value]}
                      </button>
                    ))}
                  </div>

                  {responses[item.id] === "issue" ? (
                    <label className="note-field">
                      Problema encontrado y accion sugerida
                      <textarea
                        value={notes[item.id] ?? ""}
                        onChange={(event) =>
                          setNotes((current) => ({ ...current, [item.id]: event.target.value }))
                        }
                        placeholder="Describe fuga, dano, responsable sugerido o condicion insegura."
                      />
                    </label>
                  ) : null}
                </article>
              ))}
            </div>

            <button className="submit-button" onClick={saveInspection}>
              Guardar inspeccion temporal
            </button>
          </section>
        ) : null}

        {screen === "saved-detail" && selectedInspection ? (
          <section className="stack">
            <button className="ghost-button" onClick={() => setScreen("forms")}>
              Volver a formularios
            </button>

            <div className="hero-card">
              <div>
                <p className="eyebrow">Registro temporal</p>
                <h1>{selectedInspection.formTitle}</h1>
                <p className="muted">
                  {selectedInspection.operator} / {selectedInspection.turn} /{" "}
                  {selectedInspection.date}
                </p>
              </div>
              <div className="status-pill">Guardado local</div>
            </div>

            <div className="progress-card">
              <div>
                <strong>{selectedInspection.completion}% completado</strong>
                <p>Guardado {new Date(selectedInspection.savedAt).toLocaleString("es-CO")}</p>
              </div>
              <div>
                <strong>{selectedInspection.issueCount} hallazgos</strong>
                <p>Disponible temporalmente en este navegador</p>
              </div>
            </div>

            <div className="inspection-list">
              {form.items.map((item) => {
                const response = selectedInspection.responses[item.id];

                return (
                  <article className="inspection-item" key={item.id}>
                    <div className="item-copy">
                      <span>Item {item.id} · Criticidad {item.criticality}</span>
                      <h3>{item.verify}</h3>
                      <p>{item.parameter}</p>
                    </div>

                    <div className="saved-response">
                      {response ? statusLabels[response] : "Sin respuesta"}
                    </div>

                    {selectedInspection.notes[item.id] ? (
                      <div className="saved-note">
                        <strong>Observacion</strong>
                        <p>{selectedInspection.notes[item.id]}</p>
                      </div>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </section>
        ) : null}
      </section>
    </main>
  );
}

function HomeDashboard({ onOpenForms }: { onOpenForms: () => void }) {
  return (
    <section className="stack">
      <div className="hero-card">
        <div>
          <p className="eyebrow">Pantalla de inicio</p>
          <h1>Gestion operativa digital</h1>
          <p className="muted">
            Un punto central para inspecciones, hallazgos, acciones y evidencia de cumplimiento.
          </p>
        </div>
        <button onClick={onOpenForms}>Abrir Formularios</button>
      </div>

      <div className="quick-actions">
        <button onClick={onOpenForms}>FORMULARIOS</button>
      </div>

      <section className="vision-grid">
        {productVision.map((item) => (
          <article key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
          </article>
        ))}
      </section>
    </section>
  );
}

function FormsList({
  completion,
  issueCount,
  savedInspections,
  onOpenForm,
  onViewSaved,
}: {
  completion: number;
  issueCount: number;
  savedInspections: SavedInspection[];
  onOpenForm: () => void;
  onViewSaved: (inspection: SavedInspection) => void;
}) {
  return (
    <section className="stack">
      <div className="section-heading">
        <p className="eyebrow">Modulo</p>
        <h1>Formularios</h1>
        <p className="muted">Catalogo inicial de formatos propios de la compania.</p>
      </div>

      {companyForms.map((form) => (
        <article className="form-card" key={form.id}>
          <div>
            <span className="status-pill">{form.status}</span>
            <h2>{form.title}</h2>
            <p>
              {form.area} · {form.section} · {form.equipment}
            </p>
            <small>Fuente: {form.source}</small>
          </div>
          <div className="form-card-stats">
            <strong>{form.items.length}</strong>
            <span>puntos</span>
            <strong>{completion}%</strong>
            <span>avance</span>
            <strong>{issueCount}</strong>
            <span>hallazgos</span>
          </div>
          <button onClick={onOpenForm}>Abrir formulario</button>
        </article>
      ))}

      <section className="saved-section">
        <div className="section-heading">
          <p className="eyebrow">Temporal</p>
          <h2>Formularios guardados disponibles</h2>
          <p className="muted">
            Estos registros viven por ahora en este navegador. Cuando conectemos base de datos,
            esta lista se alimentara desde el servidor.
          </p>
        </div>

        {savedInspections.length === 0 ? (
          <div className="empty-state">
            Todavia no hay formularios guardados. Abre el pre-uso, responde algunos puntos y
            guardalo temporalmente.
          </div>
        ) : (
          <div className="saved-list">
            {savedInspections.map((inspection) => (
              <article className="saved-card" key={inspection.id}>
                <div>
                  <h3>{inspection.formTitle}</h3>
                  <p>
                    {inspection.operator} · {inspection.turn} · {inspection.date}
                  </p>
                  <small>
                    Guardado {new Date(inspection.savedAt).toLocaleString("es-CO")}
                  </small>
                </div>
                <div className="form-card-stats">
                  <strong>{inspection.completion}%</strong>
                  <span>avance</span>
                  <strong>{inspection.issueCount}</strong>
                  <span>hallazgos</span>
                </div>
                <button onClick={() => onViewSaved(inspection)}>Visualizar</button>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}
