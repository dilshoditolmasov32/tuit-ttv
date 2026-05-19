

import { Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";

type Lang = "uz" | "ru" | "en";

interface AreaLike {
  id: string;
  color: string;
  title: Record<Lang, string>;
  summary: Record<Lang, string>;
  stats?: Array<{
    label: Record<Lang, string>;
    value: string;
  }>;
}

interface Props {
  area: AreaLike;
  lang: Lang;
  visible: boolean;
  /** Tooltip panel ustida qayerda ko'rinsin. default [0, 1.4, 0] */
  offset?: [number, number, number];
}

export function PanelHoverTooltip({ area, lang, visible, offset = [0, 1.4, 0] }: Props) {
  return (
    <Html position={offset} center distanceFactor={4} zIndexRange={[10, 0]}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, y: 10, scale: 0.93 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            style={{
              // pointer-events none — sichqoncha o'tib ketsin
              pointerEvents: "none",
              userSelect: "none",
              width: "220px",
              background: "rgba(2, 8, 20, 0.82)",
              backdropFilter: "blur(14px)",
              border: `1px solid ${area.color}55`,
              borderRadius: "12px",
              padding: "12px 14px",
              boxShadow: `0 0 28px ${area.color}33, 0 4px 24px rgba(0,0,0,0.6)`,
              fontFamily: "'Inter', 'Segoe UI', sans-serif",
            }}
          >
            {/* Rang chizig'i */}
            <div
              style={{
                height: "3px",
                width: "36px",
                borderRadius: "99px",
                background: area.color,
                boxShadow: `0 0 10px ${area.color}`,
                marginBottom: "8px",
              }}
            />

            {/* Sarlavha */}
            <p
              style={{
                margin: 0,
                fontSize: "13px",
                fontWeight: 600,
                color: "#f0f6ff",
                lineHeight: 1.3,
              }}
            >
              {area.title[lang]}
            </p>

            {/* Qisqa tavsif */}
            <p
              style={{
                margin: "5px 0 0",
                fontSize: "11px",
                color: "rgba(200,215,255,0.62)",
                lineHeight: 1.5,
              }}
            >
              {area.summary[lang]}
            </p>

            {/* Stats (ixtiyoriy) */}
            {area.stats && area.stats.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  marginTop: "10px",
                  flexWrap: "wrap",
                }}
              >
                {area.stats.slice(0, 3).map((s) => (
                  <div
                    key={s.label[lang]}
                    style={{
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: "6px",
                      padding: "3px 7px",
                      fontSize: "10px",
                      color: "rgba(200,215,255,0.75)",
                    }}
                  >
                    <span style={{ opacity: 0.5 }}>{s.label[lang]}: </span>
                    {s.value}
                  </div>
                ))}
              </div>
            )}

            {/* "Click" ko'rsatmasi */}
            <p
              style={{
                margin: "8px 0 0",
                fontSize: "10px",
                color: area.color,
                opacity: 0.8,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
              }}
            >
              Click to focus →
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </Html>
  );
}