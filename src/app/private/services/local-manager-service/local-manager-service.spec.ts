import { LocalManagerService } from './local-manager-service';
import { TodoItem } from '../models';

describe('LocalManagerService (zoneless)', () => {
  let service: LocalManagerService;
  let store: Record<string, string>;

  beforeEach(() => {
    // Creamos una nueva instancia del servicio antes de cada test
    service = new LocalManagerService();

    // Mock del localStorage: un objeto en memoria
    store = {};

    // Reemplazamos los métodos de localStorage por nuestro mock
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => store[key] = value);
    spyOn(localStorage, 'removeItem').and.callFake((key: string) => delete store[key]);
  });

  // --- Test básico: la instancia del servicio existe ---
  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Test guardar y leer un todo ---
  it('should save and get a todo item', () => {
    const todo: TodoItem = { id: '1', content: 'Test Todo', date: new Date(), completed: false };

    service.setToDoItem(todo);           // Guardamos
    const result = service.getToDoItem(todo); // Leemos

    expect(result?.content).toBe('Test Todo');         // Verificamos contenido
    expect(result?.date instanceof Date).toBeTrue();   // Verificamos que la fecha sea Date
    expect(result?.completed).toBeFalse();            // Verificamos completed
  });

  // --- Test actualizar contenido ---
  it('should update todo content', () => {
    const todo: TodoItem = { id: '2', content: 'Old Content', date: new Date(), completed: false };

    service.setToDoItem(todo);                  // Guardamos
    service.updateToDoItem(todo, 'New Content'); // Actualizamos

    const result = service.getToDoItem(todo);   // Leemos
    expect(result?.content).toBe('New Content'); // Verificamos actualización
  });

  // --- Test borrar item ---
  it('should erase a todo item', () => {
    const todo: TodoItem = { id: '3', content: 'To Delete', date: new Date(), completed: false };

    service.setToDoItem(todo);     // Guardamos
    service.eraseToDoItem(todo);   // Borramos

    const result = service.getToDoItem(todo); // Leemos
    expect(result).toBeNull();               // Debe ser null porque se borró
  });

  // --- Test marcar como completado (toggle) ---
  it('should toggle todo completed status', () => {
    const todo: TodoItem = { id: '4', content: 'Toggle Test', date: new Date(), completed: false };

    service.setToDoItem(todo);

    // Simulamos un toggle manual
    const toUpdate = service.getToDoItem(todo);
    if (toUpdate) {
      toUpdate.completed = !toUpdate.completed;
      service.setToDoItem(toUpdate);
    }

    const result = service.getToDoItem(todo);
    expect(result?.completed).toBeTrue();
  });
});
