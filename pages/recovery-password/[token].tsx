import { useState } from "react";
import { useRouter } from "next/router";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Spacer,
  Skeleton,
} from "@heroui/react";
import { recoveryPassword } from "@/services/userService";

export default function RecoveryPasswordPage() {
  const router = useRouter();
  const { token } = router.query;

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertType, setAlertType] = useState<
    "success" | "danger" | "warning" | "default" | "primary" | "secondary"
  >("default");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);

  const handleSubmit = async () => {
    if (!password || password.length < 8) {
      setAlertType("warning");
      setAlertMessage("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setLoading(true);
    try {
      await recoveryPassword(token as string, password);
      setAlertType("success");
      setAlertMessage("Contraseña actualizada correctamente.");
      setIsButtonDisabled(true); // Bloquear botón
      setTimeout(() => router.push("/login"), 500); // Redirección tras 500ms
    } catch (error: any) {
      setAlertType("danger");
      setAlertMessage(
        error.response?.data?.message || "Error al actualizar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h2 className="text-xl font-bold">Recuperar Contraseña</h2>
        </CardHeader>
        <CardBody>
          {loading ? (
            <>
              <Skeleton className="h-4 w-3/4 mb-4" />
              <Skeleton className="h-12 w-full rounded-lg mb-4" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </>
          ) : (
            <>
              {alertMessage && (
                <div className="mb-4">
                  <Alert color={alertType} title={alertMessage} />
                </div>
              )}
              <Input
                label="Nueva contraseña"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                isRequired
              />
              <Spacer y={4} />
              <Button
                color="primary"
                onPress={handleSubmit}
                isDisabled={isButtonDisabled}
                fullWidth
              >
                Cambiar Contraseña
              </Button>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

