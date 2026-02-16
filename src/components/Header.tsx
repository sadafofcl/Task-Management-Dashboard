import { Link, useNavigate } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { pathDashboard, pathTasklist } from "@/constants";
import useLocalStorage from "@/hooks/useLocalStorage";
import { categories } from "@/constants";

interface SubTaskType {
  title: string;
  description: string;
  category: string;
  status: string;
}

interface MainTaskType {
  id: string;
  date: string;
  title: string;
  description: string;
  category: string;
  subtaskRadio: string;
  subtasks?: SubTaskType[];
}

export default function Header() {
  const navigate = useNavigate();
  const [AllTasks] = useLocalStorage<MainTaskType[]>("savedTasks", []);

  const tasksByCategory = categories.reduce(
    (acc, category) => {
      acc[category] = AllTasks.filter(
        (task: MainTaskType) => task.category === category,
      );
      return acc;
    },
    {} as Record<string, MainTaskType[]>,
  );

  const handleCategoryClick = (category: string) => {
    navigate(`${pathTasklist}?category=${encodeURIComponent(category)}`);
  };

  return (
    <header className="fixed top-0 left-0 w-full p-4 z-50">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to={pathDashboard}>Dashboard</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to={pathTasklist}>All Tasks</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <NavigationMenuTrigger>Task Categories</NavigationMenuTrigger>
            <NavigationMenuContent>
              <div className="w-150 p-4">
                {AllTasks.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No tasks available
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    {categories.map((category) => {
                      const tasksInCategory = tasksByCategory[category];
                      return (
                        <div
                          key={category}
                          className="border border-black rounded-lg p-3 cursor-pointer hover:bg-zinc-200 transition-colors"
                          onClick={() => handleCategoryClick(category)}
                        >
                          <h3 className="font-bold text-sm mb-2 border-b border-black pb-1">
                            {category}
                            <span className="ml-2 text-xs text-gray-500">
                              ({tasksInCategory.length})
                            </span>
                          </h3>
                          {tasksInCategory.length === 0 ? (
                            <p className="text-xs text-gray-400 italic">
                              No tasks
                            </p>
                          ) : (
                            <ul className="space-y-1">
                              {tasksInCategory.slice(0, 2).map((task) => (
                                <li key={task.id} className="text-xs truncate">
                                  • {task.title}
                                </li>
                              ))}
                              {tasksInCategory.length > 2 && (
                                <li className="text-xs text-gray-500 italic">
                                  +{tasksInCategory.length - 2} more...
                                </li>
                              )}
                            </ul>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
}
