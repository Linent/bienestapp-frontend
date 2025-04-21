import { useState } from "react";
import { useRouter } from "next/router";
import {
  Input,
  Button,
  Card,
  CardBody,
  CardHeader,
  Alert,
  Skeleton,
} from "@heroui/react";

import DefaultLayout from "@/layouts/default";
import { sendRecoveryEmail } from "@/services/userService";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{
    message: string;
    type: "success" | "danger" | "warning";
  } | null>(null);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async () => {
    if (!email || !email.includes("@")) {
      setAlert({
        message: "Por favor ingresa un correo válido.",
        type: "warning",
      });

      return;
    }

    setLoading(true);
    setButtonDisabled(true);
    setAlert(null);

    try {
      await sendRecoveryEmail(email);
      setAlert({
        message: "Se ha enviado el enlace de recuperación a tu correo.",
        type: "success",
      });

      setTimeout(() => {
        router.push("/");
      }, 500);
    } catch (error: any) {
      setAlert({
        message:
          error.response?.data?.message ||
          "Error al enviar el correo de recuperación.",
        type: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <DefaultLayout>
      <div className="flex justify-center pt-20 pb-10 px-4">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <h2 className="text-xl font-bold">¿Olvidaste tu contraseña?</h2>
          </CardHeader>
          <CardBody>
            {alert && (
              <div className="mb-4">
                <Alert color={alert.type} title={alert.message} />
              </div>
            )}

            {loading ? (
              <Skeleton className="h-12 w-full rounded-lg mb-4" />
            ) : (
              <Input
                isRequired
                label="Correo electrónico"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            )}

            <Button
              fullWidth
              className="mt-4"
              color="primary"
              isDisabled={buttonDisabled}
              isLoading={loading}
              onPress={handleSubmit}
            >
              Enviar enlace de recuperación
            </Button>
          </CardBody>
        </Card>
      </div>
    </DefaultLayout>
  );
}
