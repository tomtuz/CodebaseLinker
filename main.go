package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"sync"
	"sync/atomic"
)

func readFile(filepath string, wg *sync.WaitGroup, results chan<- []byte, filenames chan<- string, count *uint64) {
	defer wg.Done()

	data, err := os.ReadFile(filepath)
	if err != nil {
		log.Printf("Error reading file %s: %v", filepath, err)
		return
	}

	results <- data
	filenames <- filepath
	atomic.AddUint64(count, 1)
}

func main() {
	rootDir := "." // Start directory
	excludeDirs := []string{"node_modules", ".git"}

	var wg sync.WaitGroup
	results := make(chan []byte, 100)    // Buffered channel to handle multiple file results
	filenames := make(chan string, 100)  // Channel to store filenames
	var fileCount uint64                 // Atomic counter for file count

	var files []string // Slice to store filenames

	err := filepath.Walk(rootDir, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip excluded directories
		for _, exclude := range excludeDirs {
			if info.IsDir() && info.Name() == exclude {
				return filepath.SkipDir
			}
		}

		// If it's a file, read it concurrently
		if !info.IsDir() {
			wg.Add(1)
			go readFile(path, &wg, results, filenames, &fileCount)
		}

		return nil
	})

	if err != nil {
		log.Fatalf("Error walking the path %v: %v", rootDir, err)
	}

	// Close the results and filenames channels once all goroutines are done
	go func() {
		wg.Wait()
		close(results)
		close(filenames)
	}()

	// Process filenames concurrently
	go func() {
		for filename := range filenames {
			files = append(files, filename)
		}
	}()

	// Process results concurrently
	for data := range results {
		fmt.Println("Read file data length:", len(data))
	}

	// Wait for filenames to be processed
	wg.Wait()

	fmt.Printf("Total files processed: %d\n", fileCount)
	fmt.Println("Files:")
	for _, file := range files {
		fmt.Println(file)
	}
}
