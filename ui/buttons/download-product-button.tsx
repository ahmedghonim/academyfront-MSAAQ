"use client";

import { useDownloadFile } from "@/hooks";

import { Button, ButtonProps } from "@msaaqcom/abjad";

type Props = Omit<ButtonProps, "isLoading" | "onPress"> & {
  fileName: string;
  filePath: string;
};

const DownloadProductButton = ({ filePath, fileName, ...rest }: Props) => {
  const { downloadFile, isDownloading } = useDownloadFile();

  return (
    <Button
      onPress={() => downloadFile(filePath, fileName)}
      isLoading={isDownloading(filePath)}
      {...rest}
    />
  );
};

export default DownloadProductButton;
