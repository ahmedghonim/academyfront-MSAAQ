import { useTranslations } from "next-intl";

import { useDownloadFile } from "@/hooks";
import { ContentAttachment, Product } from "@/types";

import { ArrowDownTrayIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

import { Button, Card, Icon, Modal, Typography } from "@msaaqcom/abjad";

interface Props {
  showModal: boolean;
  toggleModal: () => void;
  attachments: ContentAttachment[];
  product: Product | null;
}

const ProductFilesModal = ({ showModal, toggleModal, attachments, product }: Props) => {
  const t = useTranslations();
  const { downloadFile, isDownloading } = useDownloadFile();

  return (
    <Modal
      size="xl"
      open={showModal}
      onDismiss={toggleModal}
      bordered
    >
      <Modal.Header
        title={t("account.download_files", { count: attachments.length })}
        className="flex justify-between"
      >
        <Button
          color="gray"
          size="sm"
          variant="solid"
          icon={
            <Icon size="md">
              <ArrowDownTrayIcon />
            </Icon>
          }
          onPress={async () => {
            if (!product) {
              return;
            }

            await downloadFile(`/products/${product.slug}/download`, product.title);
          }}
          isLoading={product ? isDownloading(`/products/${product.slug}/download`) : false}
        >
          {t("account.download_all_files")}
        </Button>
      </Modal.Header>
      <Modal.Body className="space-y-2.5">
        {attachments.map((attachment, i) => (
          <Card
            key={i}
            className="rotate-0 border-0"
          >
            <Card.Body className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-x-4">
                <Icon
                  size="sm"
                  variant="soft"
                  color="primary"
                  className="text-gray-900"
                  rounded="full"
                >
                  <DocumentTextIcon />
                </Icon>
                <div className="flex flex-col">
                  <Typography.Body
                    size="base"
                    className="font-medium text-gray-950"
                  >
                    {attachment.file_name}
                  </Typography.Body>
                  <Typography.Body
                    size="md"
                    className="text-right font-normal text-gray-700"
                    dir="ltr"
                    children={`${(attachment.size / (1024 * 1024)).toFixed(2)} MB`}
                  />
                </div>
              </div>

              <Button
                onPress={async () => {
                  if (!product) {
                    return;
                  }
                  await downloadFile(`/products/${product.slug}/download/${attachment.uuid}`, attachment.file_name);
                }}
                isLoading={product ? isDownloading(`/products/${product.slug}/download/${attachment.uuid}`) : false}
                rounded="full"
                size="sm"
                variant="solid"
                color="gray"
                icon={
                  <Icon>
                    <ArrowDownTrayIcon />
                  </Icon>
                }
              />
            </Card.Body>
          </Card>
        ))}
      </Modal.Body>
    </Modal>
  );
};

export default ProductFilesModal;
