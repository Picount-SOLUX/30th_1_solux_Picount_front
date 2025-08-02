import React from "react";
import styles from "./ViewModal.module.css";
import { MdPhotoCamera } from "react-icons/md";
import api from "../../../api/axiosInstance";

export default function ViewModal({ onClose, data, onEdit }) {
  const { date, entries = [], memo = "", photo } = data || {};

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div
        className={styles.modalContainer}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.dateBox}>
          <span>{date}</span>
        </div>

        {entries.filter((e) => e.type === "income").length > 0 && (
          <div className={styles.section}>
            <div className={styles.label}>수입</div>
            {entries
              .filter((e) => e.type === "income")
              .map((item, idx) => (
                <div key={idx} className={styles.entryRow}>
                  <span>{item.category}</span>
                  <span>{Number(item.amount).toLocaleString()} 원</span>
                </div>
              ))}
          </div>
        )}

        {entries.filter((e) => e.type === "expense").length > 0 && (
          <div className={styles.section}>
            <div className={styles.label}>지출</div>
            {entries
              .filter((e) => e.type === "expense")
              .map((item, idx) => (
                <div key={idx} className={styles.entryRow}>
                  <span>{item.category}</span>
                  <span>{Number(item.amount).toLocaleString()} 원</span>
                </div>
              ))}
          </div>
        )}

        <div className={styles.section}>
          <div className={styles.label}>메모</div>
          <div className={styles.memoBox}>{memo || "-"}</div>
        </div>

        <div className={styles.section}>
          <div className={styles.label}>사진</div>
          {photo ? (
            <img
              className={styles.image}
              src={typeof photo === "string" ? photo : URL.createObjectURL(photo)}
              alt="uploaded"
            />
          ) : (
            <div className={styles.imagePlaceholder}>
              <MdPhotoCamera size={40} color="#999" />
            </div>
          )}
        </div>

        <div className={styles.btnRow}>
          <button className={styles.editBtn} onClick={onEdit}>
            수정
          </button>
          <button className={styles.confirmBtn} onClick={onClose}>
            확인
          </button>
        </div>
      </div>
    </div>
  );
}
