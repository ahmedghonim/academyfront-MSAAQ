import { Card } from "@msaaqcom/abjad";

export const LoadingCard = ({ showImage = true }: { showImage?: boolean }) => {
  return (
    <Card
      role="status"
      className="h-full"
    >
      <Card.Body className="flex h-full animate-pulse flex-col p-4">
        {showImage && (
          <div className="aspect-h-9 aspect-w-16 mb-6 overflow-hidden">
            <div className="absolute bottom-0 left-0 right-0 top-0 flex h-full w-full items-center justify-center rounded-2xl  bg-gray">
              <svg
                className="h-10 w-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 16 20"
              >
                <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
              </svg>
            </div>
          </div>
        )}
        <div className="flex flex-1 flex-col space-y-2">
          <div className="h-2.5 w-1/3 rounded-full bg-gray" />
          <div className="h-2 w-full rounded-full bg-gray" />
          <div className="h-2 w-full rounded-full bg-gray" />
        </div>
      </Card.Body>
    </Card>
  );
};
