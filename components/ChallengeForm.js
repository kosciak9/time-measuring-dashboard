import { Box, Input, Button, Select } from "@chakra-ui/react";
import { Formik, Form, Field } from "formik";
import { client } from "../lib/wretch";

const ChallengeForm = ({ onClose, admin_id, setForceRefresh }) => {
  return (
    <Formik
      initialValues={{ name: "", start_time: "", end_time: "", type: "", prize: "" }}
      onSubmit={(values, { setSubmitting }) => {
        client
          .url("/challenges")
          .post({ ...values, admin_id })
          .json(() => {
            setForceRefresh(true);
            setSubmitting(false);
            onClose();
          });
      }}
    >
      {({ isSubmitting }) => (
        <Box
          as={Form}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          height="300px"
        >
          <Field as={Input} name="name" placeholder="Puchar Małych Gmin" />
          <Field as={Select} name="type">
            <option value="running_pool">Wspólne kilometry</option>
            <option disabled value="async_track">
              Najszybsza trasa - asynchronicznie
            </option>
          </Field>
          <Field
            as={Input}
            name="prize"
            placeholder="Skrócony opis nagrody, np.: dofinansowanie dla szkół ze zwycięskiej gminy"
          />
          <Field as={Input} type="date" name="start_time" placeholder="Data rozpoczęcia zawodów" />
          <Field as={Input} type="date" name="end_time" placeholder="Data zakończenia zawodów" />
          <Button isFullWidth colorScheme="green" type="submit" disabled={isSubmitting} mb={2}>
            Dodaj!
          </Button>
        </Box>
      )}
    </Formik>
  );
};

export { ChallengeForm };
