import React, { useState } from "react";
import { DealProposalParams } from "../fevm/make-deal-proposal";
import styles from "./DealProposalForm.module.css";

interface DealProposalFormProps {
  onSubmit: (params: DealProposalParams) => void;
}

export default function DealProposalForm({ onSubmit }: DealProposalFormProps) {
  const [contract, setContract] = useState(
    "0xFd562F20E65e0d87598cDA7F2a1Ac348a008fA0D"
  );
  const [pieceCid, setPieceCid] = useState(
    "baga6ea4seaqhedb2m6yyr4wejjgxrrehujv5yp6ujzgebqaz22qlm6v74apw6oq"
  );
  const [pieceSize, setPieceSize] = useState(4096);
  const [verifiedDeal, setVerifiedDeal] = useState(false);
  const [label, setLabel] = useState("file-1686957219783.png");
  const [startEpoch, setStartEpoch] = useState(520000);
  const [endEpoch, setEndEpoch] = useState(1555200);
  const [storagePricePerEpoch, setStoragePricePerEpoch] = useState(0);
  const [providerCollateral, setProviderCollateral] = useState(0);
  const [clientCollateral, setClientCollateral] = useState(0);
  const [extraParamsVersion, setExtraParamsVersion] = useState("1");
  const [locationRef, setLocationRef] = useState(
    "https://data-depot.lighthouse.storage/api/download/download_car?fileId=c52f62f1-dd4d-4f02-8352-2af72442818d.car"
  );
  const [carSize, setCarSize] = useState(2061);
  const [skipIpniAnnounce, setSkipIpniAnnounce] = useState(false);
  const [removeUnsealedCopy, setRemoveUnsealedCopy] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params: DealProposalParams = {
      contract,
      pieceCid,
      pieceSize,
      verifiedDeal,
      label,
      startEpoch,
      endEpoch,
      storagePricePerEpoch,
      providerCollateral,
      clientCollateral,
      extraParamsVersion,
      locationRef,
      carSize,
      skipIpniAnnounce,
      removeUnsealedCopy,
    };
    onSubmit(params);
  };

  return (
    <form onSubmit={handleSubmit} className={styles["deal-proposal-form"]}>
      <label className={styles["deal-proposal-form__label"]}>
        Contract:
        <input
          type="text"
          value={contract}
          onChange={(e) => setContract(e.target.value)}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Piece CID:
        <input
          type="text"
          value={pieceCid}
          onChange={(e) => setPieceCid(e.target.value)}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Piece size:
        <input
          type="number"
          value={pieceSize}
          onChange={(e) => setPieceSize(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Verified deal:
        <input
          type="checkbox"
          checked={verifiedDeal}
          onChange={(e) => setVerifiedDeal(e.target.checked)}
          className={styles["deal-proposal-form__checkbox"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Label:
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Start epoch:
        <input
          type="number"
          value={startEpoch}
          onChange={(e) => setStartEpoch(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        End epoch:
        <input
          type="number"
          value={endEpoch}
          onChange={(e) => setEndEpoch(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Storage price per epoch:
        <input
          type="number"
          value={storagePricePerEpoch}
          onChange={(e) => setStoragePricePerEpoch(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Provider collateral:
        <input
          type="number"
          value={providerCollateral}
          onChange={(e) => setProviderCollateral(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Client collateral:
        <input
          type="number"
          value={clientCollateral}
          onChange={(e) => setClientCollateral(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Extra params version:
        <input
          type="text"
          value={extraParamsVersion}
          onChange={(e) => setExtraParamsVersion(e.target.value)}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Location ref:
        <input
          type="text"
          value={locationRef}
          onChange={(e) => setLocationRef(e.target.value)}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        CAR size:
        <input
          type="number"
          value={carSize}
          onChange={(e) => setCarSize(parseInt(e.target.value))}
          className={styles["deal-proposal-form__input"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Skip IPNI announce:
        <input
          type="checkbox"
          checked={skipIpniAnnounce}
          onChange={(e) => setSkipIpniAnnounce(e.target.checked)}
          className={styles["deal-proposal-form__checkbox"]}
        />
      </label>
      <label className={styles["deal-proposal-form__label"]}>
        Remove unsealed copy:
        <input
          type="checkbox"
          checked={removeUnsealedCopy}
          onChange={(e) => setRemoveUnsealedCopy(e.target.checked)}
          className={styles["deal-proposal-form__checkbox"]}
        />
      </label>
      <button
        type="submit"
        className={styles["deal-proposal-form__submit-button"]}
      >
        Submit
      </button>
    </form>
  );
}
