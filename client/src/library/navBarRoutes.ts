interface navBarRoute {
  name: string;
  route: string;
}

export const navBarRoutes: navBarRoute[] = [
  {
    name: "Home",
    route: "/"
  },
  {
    name: "Enter Workout",
    route: "/workout/new"
  },
  {
    name: "Exercise Library",
    route: "/exercise_library"
  },
  {
    name: "Template Library ",
    route: "/templates_library"
  },
]
