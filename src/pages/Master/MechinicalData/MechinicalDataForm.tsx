import React, { useEffect, useState } from "react";
import {
  Box,
  Grid,
  TextField,
  Typography,
  Button,
  Card,
  CardContent,
  Autocomplete,
  MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../contexts/AxiosContext";
import { MechanicalData } from "./MechanicalDataList";

const defaultData: MechanicalData = {
  id: 0,
  sku: '0',
  modelNumber: '0',
  typeOfDeBearing: "Ball Bearing",
  typeOfNdeBearing: "Ball Bearing",
  deBearingShield: "ZZ",
  ndeBearingShield: "ZZ",
  deBearingNumber: "",
  ndeBearingNumber: "",
  degreeOfProtection: "IP55",
  cooling: "TEFC",
  coolingType: "IC 411",
  shaftDe: "Std Single",
  shaftNde: "Std",
  description: "",
  encoderMountingArrgt: "No",
  brakeMountingArrgt: "No",
  brakeType: "EMDC",
  brakeSize: "",
  fan: "PP",
  casting: "B3",
  deEndshield: "B3",
  ndeEndshield: "B3",
};

export default function MechanicalDataForm() {
  const [form, setForm] = useState<MechanicalData>(defaultData);
  const { enqueueSnackbar } = useSnackbar();
  const [skuList, setSkuList] = useState<any[]>([]);
  const [modelList, setModelList] = useState<any[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const numericFields = ["id"];
  // Bearing Shields
  const deBearingShieldOptions = ["NIL", "Z", "ZZ", "2RS"];
  const ndeBearingShieldOptions = ["NIL", "Z", "ZZ", "2RS"];

  // Protection
  const degreeOfProtectionOptions = ["IP55", "IP56", "IP65", "IP66", "IP23", "IP44"];

  // Cooling
  const coolingOptions = ["TEFC", "TENV", "TEFV", "SPDP"];
  const coolingTypeOptions = ["IC411", "IC416", "IC418"];

  // Shaft
  const shaftDeOptions = ["Std Single", "Std DS", "Non Std"];
  const shaftNdeOptions = ["Std", "Std DS", "Non Std NDE"];

  // Mounting Arrangements
  const encoderMountingArrgtOptions = ["Yes", "No"];
  const brakeMountingArrgtOptions = ["Yes", "No"];

  // Brake
  const brakeTypeOptions = ["EMDC", "AC", "Thruster"];

  // Components
  const fanOptions = ["PP", "Al", "Brass", "CI", "No"];
  const castingOptions = ["B3", "B5"];
  const deEndshieldOptions = ["B3", "B5", "B14"];
  const ndeEndshieldOptions = ["B3", "B5", "B14"];

  useEffect(() => {
    api
      .get("/skumaster")
      .then((res) => setSkuList(res.data.filter((x: any) => x.isActive)))
      .catch(() => enqueueSnackbar("Failed to load SKUs", { variant: "error" }));

    api
      .get("/skumodel")
      .then((res) => {
        setModelList(res.data.filter((x: any) => x.isActive));
      })
      .catch(() =>
        enqueueSnackbar("Failed to load Models", { variant: "error" })
      );

    if (isEdit) {
      api
        .get(`/mechanicaldesignmaster/${id}`)
        .then((res) => {
          setForm(res.data);
        })
        .catch(() =>
          enqueueSnackbar("Failed to load data", { variant: "error" })
        );
    }
  }, [id]);

  const handleChange = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: numericFields.includes(field) ? Number(value) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.sku || !form.modelNumber || !form.coolingType) {
      enqueueSnackbar("Please fill required fields", { variant: "warning" });
      return;
    }

    try {
      if (isEdit) {
        await api.put(`/mechanicaldesignmaster/${id}`, form);
        enqueueSnackbar("Updated successfully", { variant: "success" });
      } else {
        await api.post("/mechanicaldesignmaster", form);
        enqueueSnackbar("Created successfully", { variant: "success" });
      }
      navigate("/mechanical-data");
    } catch {
      enqueueSnackbar("Operation failed", { variant: "error" });
    }
  };

  const renderSection = (
    title: string,
    fields: { label: string; key: keyof MechanicalData; options?: string[] }[]
  ) => (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Grid container spacing={2}>
          {fields.map(({ label, key, options }) => (
            <Grid size={{ xs: 12, sm: 6 }} key={key}>
              {options ? (
                <TextField
                  select
                  fullWidth
                  label={label}
                  value={form[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                >
                  {options.map((opt) => (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ))}
                </TextField>
              ) : (
                <TextField
                  fullWidth
                  label={label}
                  value={form[key] || ""}
                  onChange={(e) => handleChange(key, e.target.value)}
                />
              )}
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Box p={3}>
      <Typography variant="h5" mb={3}>
        {isEdit ? "Edit" : "Add"} Mechanical Data
      </Typography>

      {/* ✅ Basic Info Section with SKU + Model */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Basic Info
          </Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                options={skuList}
                getOptionLabel={(option: any) => option.sku || ""}
                value={skuList.find((s) => s.sku === form.sku) || null}
                onChange={(e, newValue) => {
                  handleChange("sku", newValue ? newValue.sku : '0');
                  handleChange("modelNumber", 0); // reset when SKU changes
                }}
                renderInput={(params) => <TextField {...params} label="SKU" fullWidth />}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                select
                label="Model"
                name="modelNumber"
                value={form.modelNumber || 0}
                onChange={(e) => handleChange("modelNumber", e.target.value)}
                fullWidth
              >
                {modelList
                  .filter((m) => m.sku.sku === form.sku)
                  .map((m) => (
                    <MenuItem key={m.id} value={m.model}>
                      {m.model}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {renderSection("Bearings", [
        { label: "Type of DE Bearing", key: "typeOfDeBearing", options: deBearingShieldOptions },
        { label: "Type of NDE Bearing", key: "typeOfNdeBearing", options: ndeBearingShieldOptions },
        { label: "DE Bearing Shield", key: "deBearingShield" },
        { label: "NDE Bearing Shield", key: "ndeBearingShield" },
        { label: "DE Bearing Number", key: "deBearingNumber" },
        { label: "NDE Bearing Number", key: "ndeBearingNumber" },
      ])}

      {renderSection("Protection & Cooling", [
        { label: "Degree of Protection", key: "degreeOfProtection", options: degreeOfProtectionOptions },
        { label: "Cooling", key: "cooling", options: coolingOptions },
        { label: "Cooling Type", key: "coolingType", options: coolingTypeOptions },
      ])}

      {renderSection("Shaft & Mounting", [
        { label: "Shaft DE", key: "shaftDe", options: shaftDeOptions },
        { label: "Shaft NDE", key: "shaftNde", options: shaftNdeOptions },
        { label: "Encoder Mounting Arrangement", key: "encoderMountingArrgt", options: encoderMountingArrgtOptions },
        { label: "Brake Mounting Arrangement", key: "brakeMountingArrgt", options: brakeMountingArrgtOptions },
        { label: "Brake Type", key: "brakeType", options: brakeTypeOptions },
        { label: "Brake Size", key: "brakeSize" }, // stays text
        { label: "Description", key: "description" }, 
      ])}

      {renderSection("Components", [
        { label: "Fan", key: "fan", options: fanOptions },
        { label: "Casting", key: "casting", options: castingOptions },
        { label: "DE Endshield", key: "deEndshield", options: deEndshieldOptions },
        { label: "NDE Endshield", key: "ndeEndshield", options: ndeEndshieldOptions },
      ])}

      <Box mt={2}>
        <Button variant="contained" onClick={handleSubmit}>
          {isEdit ? "Update" : "Add"}
        </Button>
        <Button sx={{ ml: 2 }} onClick={() => navigate("/mechanical-data")}>
          Cancel
        </Button>
      </Box>
    </Box>
  );
}
