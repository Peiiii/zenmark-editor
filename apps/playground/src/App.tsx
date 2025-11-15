import { useLocalStorageString } from "./hooks/useLocalStorage";
import { STORAGE_KEYS } from "./constants";
import { examples, getExample } from "./examples";
import type { ExampleId } from "./examples/types";
import { Tabs } from "./components/Tabs";

export default function App() {
  const [currentExampleId, setCurrentExampleId] = useLocalStorageString(
    STORAGE_KEYS.EXAMPLE_ID,
    "basic"
  );

  const currentExample = getExample(currentExampleId as ExampleId) || examples[0];
  const ExampleComponent = currentExample.component;

  return (
    <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
      <div className="p-4 border-b flex-shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold">Zenmark Playground</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {currentExample.description}
            </p>
          </div>
        </div>
        <Tabs
          value={currentExampleId}
          onValueChange={(value) => setCurrentExampleId(value)}
          items={examples.map((ex) => ({ id: ex.id, label: ex.name }))}
        />
      </div>
      <div className="flex-1 overflow-hidden min-h-0">
        <ExampleComponent />
      </div>
    </div>
  );
}
