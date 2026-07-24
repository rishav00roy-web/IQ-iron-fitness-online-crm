import os

css = '''
/* ==========================================================================
   MOBILE OPTIMIZATION (iPhone 15 Pro Max / Android)
   ========================================================================== */
@media (max-width: 768px) {
  .app {
    padding: 16px;
    gap: 16px;
  }
  
  .app-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    padding: 16px;
  }
  
  .brand {
    width: 100%;
    justify-content: space-between;
  }
  
  .toolbar {
    width: 100%;
    flex-wrap: wrap;
    gap: 8px;
  }
  
  .toolbar .btn {
    flex: 1 1 calc(50% - 8px);
    justify-content: center;
  }
  
  .metrics-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }
  
  .grid-toolbar {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }
  
  .search-wrap {
    max-width: 100%;
  }
  
  .tabs {
    width: 100%;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    white-space: nowrap;
  }
  
  .tabs::-webkit-scrollbar {
    height: 4px;
  }
  .tabs::-webkit-scrollbar-thumb {
    background: var(--border);
    border-radius: 4px;
  }
  
  .table-wrap {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
    margin: 0 -16px;
    padding: 0 16px;
  }
  
  dialog {
    width: 95vw;
    max-height: 90vh;
    margin: auto;
    padding: 0;
    border-radius: 16px;
  }
  
  .dialog-body {
    padding: 16px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 16px;
  }
  
  .app-footer {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
}
'''

path = r'C:\Users\User\Documents\antigravity\lucid-heisenberg\src\app\globals.css'
with open(path, 'a', encoding='utf-8') as f:
    f.write(css)

print('Mobile CSS appended to globals.css')
