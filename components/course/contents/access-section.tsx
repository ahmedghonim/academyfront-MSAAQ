"use client";

import { LockClosedIcon } from "@heroicons/react/24/solid";

import { Button, Card, Icon, Typography } from "@msaaqcom/abjad";

const AccessSection = () => {
  return (
    <Card>
      <Card.Body className="flex flex-col items-center gap-6 py-6">
        <Icon
          color="info"
          rounded="base"
          size="xl"
          variant="solid"
        >
          <LockClosedIcon />
        </Icon>
        <div className="flex flex-col items-center">
          <Typography.Body children="هذا الدرس معتمد على الدروس السابقة" />
          <Typography.Body
            className="text-gray-700"
            size="md"
            children="هناك بعض الدروس المرتبطة بالدروس التي تسبقها، لذا لا يمكنك مشاهدة هذا الدرس الا اذا أكملت الدرس السابق."
          />
        </div>
        <Button
          color="gray"
          children="الدرس السابق"
        />
      </Card.Body>
    </Card>
  );
};

export default AccessSection;
