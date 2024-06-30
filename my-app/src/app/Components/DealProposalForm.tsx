import React, { useState } from "react";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

interface DealProposalFormProps {
  onSubmit: (params: any) => void;
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

  const methods = useForm();
  const { handleSubmit, control } = methods;

  const onFormSubmit = (data: any) => {
    const params = {
      ...data,
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
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
        <FormItem>
          <FormLabel>Contract</FormLabel>
          <Controller
            name="task_id"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Task ID" {...field} required />
            )}
          />
          <FormDescription>
            This is the unique identifier for the task.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Piece CID:</FormLabel>
          <Controller
            name="piece_cid"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Piece CID" {...field} required />
            )}
          />
          <FormDescription>
            This is the CID for the piece of data.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Piece size:</FormLabel>
          <Controller
            name="piece_size"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Piece Size" {...field} required />
            )}
          />
          <FormDescription>This is the size of the piece.</FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Verified deal:</FormLabel>
          <Controller
            name="verified_deal"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Verified Deal" {...field} required />
            )}
          />
          <FormDescription>
            This is the verification status of the deal.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Label:</FormLabel>
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Label" {...field} required />
            )}
          />
          <FormDescription>This is the label for the piece.</FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Start epoch:</FormLabel>
          <Controller
            name="start_epoch"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter Start Epoch" {...field} required />
            )}
          />
          <FormDescription>This is the start epoch.</FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>End epoch:</FormLabel>
          <Controller
            name="end_epoch"
            control={control}
            render={({ field }) => (
              <Input placeholder="Enter End Epoch" {...field} required />
            )}
          />
          <FormDescription>This is the end epoch.</FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Storage price per epoch:</FormLabel>
          <Controller
            name="storage_price_per_epoch"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Storage Price per Epoch"
                {...field}
                required
              />
            )}
          />
          <FormDescription>
            This is the storage price per epoch.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Provider collateral:</FormLabel>
          <Controller
            name="provider_collateral"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Provider Collateral"
                {...field}
                required
              />
            )}
          />
          <FormDescription>
            This is the provider collateral amount.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <FormItem>
          <FormLabel>Remove unsealed copy:</FormLabel>
          <Controller
            name="remove_unsealed_copy"
            control={control}
            render={({ field }) => (
              <Input
                placeholder="Enter Remove Unsealed Copy"
                {...field}
                required
              />
            )}
          />
          <FormDescription>
            This indicates if the unsealed copy should be removed.
          </FormDescription>
          <FormMessage />
        </FormItem>
        <Button type="submit">Submit</Button>
      </form>
    </FormProvider>
  );
}
