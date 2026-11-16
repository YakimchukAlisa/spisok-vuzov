import { Refine } from "@refinedev/core";
import routerProvider from "@refinedev/react-router";
import { Routes, Route, Navigate } from "react-router-dom";
import "@refinedev/antd/dist/reset.css";

import { AdminLayout } from "./AdminLayout";
import { customDataProvider } from "./dataProvider";

// Вузы
import { UniversityList } from "./pages/universities/list";
import { UniversityCreate } from "./pages/universities/create";
import { UniversityEdit } from "./pages/universities/edit";

// Факультеты
import { FacultyList } from "./pages/faculties/list";
import { FacultyCreate } from "./pages/faculties/create";
import { FacultyEdit } from "./pages/faculties/edit";

// Направления
import { DirectionList } from "./pages/directions/list";
import { DirectionCreate } from "./pages/directions/create";
import { DirectionEdit } from "./pages/directions/edit";

import { ProfileList } from "./pages/profiles/list";
import { ProfileCreate } from "./pages/profiles/create";
import { ProfileEdit } from "./pages/profiles/edit";

import { SphereList } from "./pages/spheres/list";
import { SphereCreate } from "./pages/spheres/create";
import { SphereEdit } from "./pages/spheres/edit";

import { ProfessionList } from "./pages/professions/list";
import { ProfessionCreate } from "./pages/professions/create";
import { ProfessionEdit } from "./pages/professions/edit";

import { TestQuestionList } from "./pages/test/list";
import { TestQuestionCreate } from "./pages/test/create";
import { TestQuestionEdit } from "./pages/test/edit";
import { TestOptions } from "./pages/test/options";

export function AdminApp() {
  return (
    <Refine
      dataProvider={customDataProvider}
      routerProvider={routerProvider}
      resources={[
        {
          name: "universities",
          list: "/admin/universities",
          create: "/admin/universities/create",
          edit: "/admin/universities/edit/:id",
        },
      ]}
    >
      <Routes>
        <Route element={<AdminLayout />}>
          <Route index element={<Navigate to="/admin/universities" replace />} />

          {/* --- ВУЗЫ --- */}
          <Route path="universities" element={<UniversityList />} />
          <Route path="universities/create" element={<UniversityCreate />} />
          <Route path="universities/edit/:id" element={<UniversityEdit />} />

          {/* --- ФАКУЛЬТЕТЫ --- */}
          <Route path="universities/:id/faculties" element={<FacultyList />} />
          <Route path="universities/:id/faculties/create" element={<FacultyCreate />} />
          <Route path="universities/:id/faculties/edit/:facultyId" element={<FacultyEdit />} />

          {/* --- НАПРАВЛЕНИЯ --- */}
          <Route path="universities/:id/faculties/:facultyId/directions" element={<DirectionList />} />
          <Route path="universities/:id/faculties/:facultyId/directions/create" element={<DirectionCreate />} />
          <Route path="universities/:id/faculties/:facultyId/directions/edit/:directionId" element={<DirectionEdit />} />

          {/* МАРШРУТЫ ДЛЯ ПРОФИЛЕЙ */}
          <Route path="universities/:id/faculties/:facultyId/directions/:directionId/profiles" element={<ProfileList />} />
          <Route path="universities/:id/faculties/:facultyId/directions/:directionId/profiles/create" element={<ProfileCreate />} />
          <Route path="universities/:id/faculties/:facultyId/directions/:directionId/profiles/edit/:profileId" element={<ProfileEdit />} />
          {/* Сферы */}
          <Route path="spheres" element={<SphereList />} />
          <Route path="spheres/create" element={<SphereCreate />} />
          <Route path="spheres/edit/:id" element={<SphereEdit />} />

          {/* Профессии */}
          <Route path="professions" element={<ProfessionList />} />
          <Route path="professions/create" element={<ProfessionCreate />} />
          <Route path="professions/edit/:id" element={<ProfessionEdit />} />

          <Route path="test" element={<TestQuestionList />} />
          <Route path="test/create" element={<TestQuestionCreate />} />
          <Route path="test/edit/:id" element={<TestQuestionEdit />} />
          <Route path="test/:id/options" element={<TestOptions />} />
        </Route>
      </Routes>
    </Refine>
  );
}